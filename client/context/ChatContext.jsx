import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { ChatContext } from "./ChatContextValue";
import { messagesDummyData, userDummyData } from "../src/assets/assets";

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState(userDummyData);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    const getUsers = useCallback(async () => {
        try {
            const { data } = await axios.get("/api/messages/user");
            if (data.success) {
                setUsers(data.users?.length ? data.users : userDummyData);
                setUnseenMessages(data.unseenMessages || {});
            }
        } catch (error) {
            setUsers(userDummyData);
            setUnseenMessages({});
            toast.error(error.message);
        }
    }, [axios]);

    const getMessages = useCallback(async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages?.length ? data.messages : messagesDummyData);
            }
        } catch (error) {
            setMessages(messagesDummyData);
            toast.error(error.message);
        }
    }, [axios]);

    const sendMessage = useCallback(async (messageData) => {
        if (!selectedUser) return;

        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [axios, selectedUser]);

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                setMessages((prevMessages) => [...prevMessages, { ...newMessage, seen: true }]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
                        ? prevUnseenMessages[newMessage.senderId] + 1
                        : 1,
                }));
            }
        };

        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, [axios, socket, selectedUser]);

    const value = useMemo(() => ({
        messages,
        users,
        selectedUser,
        unseenMessages,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        setUnseenMessages,
    }), [getMessages, getUsers, messages, selectedUser, sendMessage, unseenMessages, users]);

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};
