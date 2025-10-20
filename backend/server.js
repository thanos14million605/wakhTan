import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolution = path.resolve(__dirname, "./../config.env");

import dotenv from "dotenv";
dotenv.config({
  path: resolution,
});

import express from "express";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectToDB from "./db/db.js";
import setupSocket from "./socket/socket.js";

connectToDB(process.env.MONGO_URI);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

setupSocket(io);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "./../frontend/dist")));

  app.use((_, res) => {
    res.sendFile(path.join((__dirname, "./../frontend/dist/index.html")));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
