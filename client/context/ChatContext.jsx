import { createContext, useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import {toast} from "react-hot-toast"
import { messagesDummyData, userDummyData } from "../src/assets/assets";

export const ChatContext = createContext();

export const ChatProvider = ({children})=>{

        const [messages, setMessages] = useState([]);
        const [users, setUsers] = useState(userDummyData);
        const [selectedUser, setSelectedUser] = useState(null);
        const [unseenMessages, setUnseenMessages] = useState({});

    const {socket, axios} = useContext(AuthContext);

    // get all users for sidebar

    const getUsers = async ()=>{
        try {
            const {data} = await axios.get("/api/messages/user")
            if(data.success){
                setUsers(data.users?.length ? data.users : userDummyData)
                setUnseenMessages(data.unseenMessages || {})
            }

        } catch (error) {
            setUsers(userDummyData)
            setUnseenMessages({})
            toast.error(error.message) 
        }
    }


    // get messages with selected user

    const getMessages = async(userId)=>{
        try {
            const {data} = await axios.get(`/api/messages/${userId}`)
            if (data.success){
                setMessages(data.messages?.length ? data.messages : messagesDummyData)
            }
        } catch (error) {
            setMessages(messagesDummyData)
            toast.error(error.message)
        }
    }

    // send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success) {
                setMessages((prevMessages)=>[...prevMessages, data.newMessage])
            }else{
                toast.error(data.message)
            }
        } catch (error) {   
            toast.error(error.message);
        }
    }

    // subscribe to message to selected User
    const subscribeToMessages = async()=>{
        if (!socket) return
            
        socket.on("newMessage", (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`)
            } else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        } )
        
    }

    //  unsubscribe from messages
    const unsubscribeFromMessages = ()=>{
        if (socket) socket.off("newMessage"); 
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])


    const value = {
        messages,
        users, 
        selectedUser, 
        getUsers, 
        getMessages, 
        sendMessage, 
        setSelectedUser, 
        unseenMessages, 
        setUnseenMessages
    }
    return (
    <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
    )
}

