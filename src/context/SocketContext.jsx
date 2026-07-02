import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "";

function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return;

    let currentUser;
    try {
      currentUser = JSON.parse(stored);
    } catch {
      return;
    }

    if (!currentUser?._id) return;

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("join", currentUser._id);
    });

    newSocket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}

function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
}

export { SocketProvider, useSocket };
