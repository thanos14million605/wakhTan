import { io } from "socket.io-client";

const socket = io("https://wakhtan.onrender.com", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
});

export default socket;
