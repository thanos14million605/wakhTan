import { useEffect, useState } from "react";
import socket from "../socket/socket";

const useSocket = (userId) => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!userId) {
      if (socket.connected) socket.disconnect();
      return;
    }

    if (!socket.connected) socket.connect();
    // Register the user on connection
    socket.emit("register", userId);

    // Listen for online user updates
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    // Cleanup on unmount or userId change
    return () => {
      socket.off("onlineUsers");
    };
  }, [userId]);

  return { onlineUsers };
};

export default useSocket;
