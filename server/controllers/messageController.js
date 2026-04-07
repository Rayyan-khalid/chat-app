import User from "../models/User.js";
import Message from "../models/Message.js";
import cloudinary from "../lib/cloudinary.js";
import {io, userSocketMap} from "../server.js"


// Get all user accept the logged in User
export const getUserForSidebar = async(req, res)=>{
    try{
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select("-password");

        // Count number of messages for each user
        const unseenMessages = {}
        const promises = filteredUsers.map(async (user)=>{
            const messages = await Message.find({sender: user._id, receiver: userId, seen: false});
            if(messages.length > 0){
                unseenMessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);

        res.json({success: true, users: filteredUsers, unseenMessages});
    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// Get all messages for selected User
export const getMessages = async(req, res)=>{
    try{
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;

        const message = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })

        await Message.updateMany({senderId: selectedUserId, receiverId: myId, seen: false}, {seen: true});

        res.json({success: true, messages: message});

    } catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}


// api to mark messages as seen using message id
export const markMessageAsSeen = async(req, res)=>{
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { seen: true });
        res.json({ success: true, message: "Message marked as seen" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
// Send message to selected user
export const sendMessage = async(req, res)=>{
    try {
        const {text, image} = req.body;
        const recieverId = req.params.id;
        const senderId = req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            recieverId,
            text,
            image:imageUrl
        })

        // Emit thenew message to the reciever's socket
        const recieverSocketId = userSocketMap[recieverId];
        if (recieverSocketId){
            io.to(recieverSocketId).emit("newMessage", newMessage)
        }

        res.json({success: true, newMessage});

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
