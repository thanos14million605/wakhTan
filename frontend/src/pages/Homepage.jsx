import React, { useContext, useEffect } from "react";

import MessageWindow from "../features/messages/MessageWindow";
import ChatList from "../features/messages/ChatList";
import Navbar from "../ui/Navbar";
import SpinnerFullPage from "../ui/SpinnerFullPage";

import { FaMessage } from "react-icons/fa6";

import useAuthStore from "../store/useAuthStore";
import useSocket from "../hooks/useSocket";
import { ContactsContext } from "../contexts/ContactContext";
import { useQueryClient } from "@tanstack/react-query";
import socket from "../socket/socket";
import notificationSound from "./../assets/alert.mp3";

const Homepage = () => {
  const { isLoggingOut, authUser } = useAuthStore();
  const { selectedContactId } = useContext(ContactsContext);
  useSocket(authUser ? authUser?._id : null);

  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on("newMessage", ({ senderId }) => {
      const alert = new Audio(notificationSound);
      alert.play();

      queryClient.invalidateQueries({ queryKey: [`messages-${senderId}`] });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    });

    return () => {
      socket.off("newMessage");
    };
  }, [queryClient]);

  useEffect(() => {
    socket.on("newUserJoined", () => {
      queryClient.invalidateQueries({
        queryKey: ["contacts"],
      });
    });

    return () => socket.off("newUserJoined");
  }, [queryClient]);

  useEffect(() => {
    socket.on("messageDeleted", ({ senderId }) => {
      queryClient.invalidateQueries({
        queryKey: [`messages-${senderId}`],
      });
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    });

    return () => socket.off("messageDeleted");
  }, [queryClient]);

  if (isLoggingOut) return <SpinnerFullPage />;

  return (
    <div className="min-h-screen bg-[#0a1122] text-white">
      <Navbar />
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        <div
          className={`w-full md:w-[30%] ${
            selectedContactId ? "hidden md:block" : "block"
          }`}
        >
          <ChatList />
        </div>

        <div
          className={`w-full md:w-[70%] ${
            selectedContactId ? "block" : "hidden md:block"
          }`}
        >
          {!selectedContactId ? (
            <div className="h-full flex flex-col gap-3 items-center justify-center">
              <FaMessage className="text-5xl text-amber-400" />
              <p className="text-slate-400 text-xl">
                Select a chat to start messaging
              </p>
            </div>
          ) : (
            <MessageWindow />
          )}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
