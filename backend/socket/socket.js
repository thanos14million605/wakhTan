import User from "../models/userModel.js";

export const onlineUsers = new Map();

const setupSocket = (io) => {
  io.on("connection", (socket) => {
    socket.on("register", async (userId) => {
      const user = await User.findById(userId);
      if (!user) return;

      onlineUsers.set(userId, {
        _id: user._id,
        userName: user.userName,
        socketId: socket.id,
      });

      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });

    socket.on("disconnect", () => {
      for (const [userId, user] of onlineUsers.entries()) {
        if (user.socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    });
  });
};

export default setupSocket;
