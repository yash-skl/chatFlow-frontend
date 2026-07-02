import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import ChatHeader from "../components/ChatHeader.jsx";
import MessageList from "../components/MessageList.jsx";
import MessageInput from "../components/MessageInput.jsx";
import { useSocket } from "../context/SocketContext.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "";

function getUserId(userRef) {
  if (!userRef) return null;
  return typeof userRef === "object" ? userRef._id : userRef;
}

function isMessageInChat(message, currentUserId, selectedUserId) {
  const senderId = getUserId(message.senderId);
  const receiverId = getUserId(message.receiverId);

  return (
    (String(senderId) === String(currentUserId) &&
      String(receiverId) === String(selectedUserId)) ||
    (String(senderId) === String(selectedUserId) &&
      String(receiverId) === String(currentUserId))
  );
}

function ChatPage() {
  const navigate = useNavigate();
  const { socket, onlineUsers } = useSocket();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setCurrentUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/v1/users/users`, {
          params: { currentUserId: currentUser._id },
        });
        setUsers(data.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    setIsTyping(false);
  }, [selectedUser]);

  useEffect(() => {
    if (!selectedUser || !currentUser?._id) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const { data } = await axios.get(`${API_BASE}/api/v1/messages/messages`, {
          params: {
            currentUserId: currentUser._id,
            receiverId: selectedUser._id,
          },
        });
        setMessages(data.data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  // Step 8: Mark messages as read when conversation is open
  useEffect(() => {
    if (!socket || !selectedUser || !currentUser || loadingMessages) return;

    const hasUnread = messages.some(
      (m) =>
        String(getUserId(m.senderId)) === String(selectedUser._id) && !m.read
    );

    if (!hasUnread) return;

    socket.emit("messageRead", {
      senderId: selectedUser._id,
      receiverId: currentUser._id,
    });

    setMessages((prev) =>
      prev.map((m) =>
        String(getUserId(m.senderId)) === String(selectedUser._id)
          ? { ...m, read: true, delivered: true }
          : m
      )
    );
  }, [messages, selectedUser, loadingMessages, socket, currentUser]);

  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    const handleNewMessage = (message) => {
      const isReceiver =
        String(getUserId(message.receiverId)) === String(currentUser._id);

      // Step 7: Notify sender that message was delivered
      if (isReceiver) {
        socket.emit("messageDelivered", {
          messageId: message._id,
          senderId: getUserId(message.senderId),
        });
      }

      if (!selectedUser?._id) return;
      if (!isMessageInChat(message, currentUser._id, selectedUser._id)) return;

      setMessages((prev) => {
        if (prev.some((m) => String(m._id) === String(message._id))) {
          return prev;
        }
        return [...prev, message];
      });
    };

    const handleMessageDelivered = ({ messageId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          String(m._id) === String(messageId) ? { ...m, delivered: true } : m
        )
      );
    };

    const handleMessageRead = ({ readerId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          String(getUserId(m.senderId)) === String(currentUser._id) &&
          String(getUserId(m.receiverId)) === String(readerId)
            ? { ...m, read: true, delivered: true }
            : m
        )
      );
    };

    const handleTyping = ({ senderId }) => {
      if (
        selectedUser &&
        String(senderId) === String(selectedUser._id)
      ) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (
        selectedUser &&
        String(senderId) === String(selectedUser._id)
      ) {
        setIsTyping(false);
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messageRead", handleMessageRead);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messageRead", handleMessageRead);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, currentUser, selectedUser]);

  const handleSendMessage = async (content) => {
    if (!currentUser?._id || !selectedUser?._id) return;

    setIsTyping(false);

    try {
      const { data } = await axios.post(`${API_BASE}/api/v1/messages/message`, {
        senderId: currentUser._id,
        receiverId: selectedUser._id,
        content,
      });
      setMessages((prev) => [...prev, data.data]);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleTyping = () => {
    if (!socket || !currentUser?._id || !selectedUser?._id) return;

    socket.emit("typing", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
  };

  const handleStopTyping = () => {
    if (!socket || !currentUser?._id || !selectedUser?._id) return;

    socket.emit("stopTyping", {
      senderId: currentUser._id,
      receiverId: selectedUser._id,
    });
  };

  const isSelectedUserOnline =
    selectedUser &&
    onlineUsers.some((id) => String(id) === String(selectedUser._id));

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-400">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      <div className="h-full shrink-0">
        <Sidebar
          users={users}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          onlineUsers={onlineUsers}
          currentUser={currentUser}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          selectedUser={selectedUser}
          isOnline={isSelectedUserOnline}
          isTyping={isTyping}
        />

        {loadingMessages ? (
          <div className="flex flex-1 items-center justify-center overflow-y-auto">
            <p className="text-sm text-slate-500">Loading messages...</p>
          </div>
        ) : (
          <MessageList
            messages={messages}
            currentUser={currentUser}
            selectedUser={selectedUser}
            isTyping={isTyping}
          />
        )}

        <MessageInput
          onSend={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!selectedUser}
        />
      </div>
    </div>
  );
}

export default ChatPage;
