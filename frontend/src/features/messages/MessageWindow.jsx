import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, Image as ImageIcon, Send, X } from "lucide-react";
import useContacts from "../../hooks/useContacts";
import useGetMessages from "./hooks/useGetMessages";
import useAuthStore from "../../store/useAuthStore";
import useSendMessage from "./hooks/useSendMessage";
import formatTime from "../../utils/formatTime";
import { useQueryClient } from "@tanstack/react-query";
import { Atom } from "react-loading-indicators";
import useDeleteMessage from "./hooks/useDeleteMessage";
import { FaChevronDown } from "react-icons/fa";

const MessageWindow = () => {
  const queryClient = useQueryClient();
  const { selectedContactId, onSelectContact, selectedContactUserName } =
    useContacts();
  const { messages, isFetchingMessages } = useGetMessages(selectedContactId);
  const { sendMessageMutate } = useSendMessage(selectedContactId);
  const { deleteMessageMutate } = useDeleteMessage(selectedContactId);
  const { authUser } = useAuthStore();
  const [message, setMessage] = useState("");
  const [messageActionActive, setMessageActionActive] = useState(false);
  const [messageToDeleteId, setMessageToDeleteId] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputAreaRef = useRef(null);

  const scrollToBottom = () => {
    const container = chatContainerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, filePreview]);

  useEffect(() => {
    scrollToBottom();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFilePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessageMutate({ text: message, contactId: selectedContactId });

    queryClient.invalidateQueries({ queryKey: ["contacts"] });

    setMessage("");
    setFilePreview(null);

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // default height
    }
  };

  const handleSendImage = () => {
    if (!filePreview) return;

    sendMessageMutate({ image: filePreview, contactId: selectedContactId });

    queryClient.invalidateQueries({ queryKey: ["contacts"] });

    setMessage("");
    setFilePreview(null);

    scrollToBottom();

    // Reset textarea height after sending
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // default height
    }
  };

  const handleCancelPreview = () => {
    setFilePreview(null);
  };

  const handleDeleteMessage = () => {
    deleteMessageMutate({
      messageId: messageToDeleteId,
      contactId: selectedContactId,
    });

    setMessageToDeleteId(null);
    setMessageActionActive(false);
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex items-center gap-3 border-b border-slate-700 p-[14px] bg-[#0f172e]">
        <button
          className="md:hidden text-white cursor-pointer"
          onClick={() => onSelectContact(null)}
        >
          <ChevronLeft size={24} />
        </button>

        <h2 className="font-medium">{selectedContactUserName}</h2>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth"
      >
        {!isFetchingMessages ? (
          <div>
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex flex-col mb-3 ${
                  msg.senderId === authUser._id ? "items-end" : "items-start"
                }`}
              >
                {msg.text !== undefined ? (
                  <div className="flex flex-row gap-3 items-center">
                    <div
                      className={`px-3 py-2 rounded-xl max-w-xs break-words ${
                        msg.senderId === authUser?._id && msg.text
                          ? `${
                              msg.text === "This message has been deleted" ||
                              msg.text === "This image has been deleted"
                                ? "bg-slate-400 text-gray-800"
                                : "bg-amber-400 text-slate-800"
                            }`
                          : `${
                              msg.text === "This message has been deleted" ||
                              msg.text === "This image has been deleted"
                                ? "bg-slate-400 text-gray-800"
                                : "bg-slate-800 text-gray-200"
                            }`
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg?.senderId === authUser?._id &&
                      !messageActionActive &&
                      msg.text !== "This message has been deleted" &&
                      msg.text !== "This image has been deleted" && (
                        <FaChevronDown
                          className="cursor-pointer"
                          onClick={() => {
                            setMessageActionActive(true);
                            setMessageToDeleteId(msg._id);
                          }}
                        />
                      )}
                    {messageActionActive && msg._id === messageToDeleteId && (
                      <div className="flex flex-col bg-slate-800 rounded-md justify-between">
                        <p
                          onClick={handleDeleteMessage}
                          className="rounded-tr-md rounded-tl-md cursor-pointer hover:bg-slate-900 pl-1 pr-4 py-2 text-red-400 hover:text-red-400 border-b-[1px] border-b-slate-300"
                        >
                          Delete
                        </p>
                        <p className="rounded-tr-md rounded-tl-md cursor-pointer pl-2 pr-4 py-1 text-gray-200 hover:bg-slate-900 border-b-[1px] border-b-slate-300">
                          Edit
                        </p>
                        <p
                          onClick={() => setMessageActionActive((a) => !a)}
                          className="rounded-tr-md rounded-tl-md cursor-pointer pl-2 pr-4 py-1 text-gray-400 hover:bg-slate-900"
                        >
                          Cancel
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-row gap-3 items-center">
                    <div className="w-[90%] max-w-[270px] rounded-lg">
                      {!msg.imageUrl ? (
                        <div className="mx-auto rounded-md h-[80px] w-[200px] flex items-center justify-center">
                          <Atom
                            color="blue"
                            size="small"
                            text=""
                            textColor=""
                          />
                        </div>
                      ) : (
                        <img
                          src={msg.imageUrl}
                          alt="Message Image"
                          className="w-full h-auto max-h-[70vh] object-fit rounded-lg"
                        />
                      )}
                    </div>
                    {msg?.senderId === authUser?._id &&
                      !messageActionActive &&
                      msg.text !== "This message has been deleted" &&
                      msg.text !== "This image has been deleted" && (
                        <FaChevronDown
                          className="cursor-pointer"
                          onClick={() => {
                            setMessageActionActive(true);
                            setMessageToDeleteId(msg._id);
                          }}
                        />
                      )}
                    {messageActionActive && msg._id === messageToDeleteId && (
                      <div className="flex flex-col bg-slate-800 rounded-md justify-between">
                        <p
                          onClick={handleDeleteMessage}
                          className="rounded-tr-md rounded-tl-md cursor-pointer hover:bg-slate-900 pl-1 pr-4 py-2 text-red-400 hover:text-red-400 border-b-[1px] border-b-slate-300"
                        >
                          Delete
                        </p>

                        <p
                          onClick={() => {
                            setMessageActionActive((a) => !a);
                            setMessageToDeleteId(null);
                          }}
                          className="rounded-tr-md rounded-tl-md cursor-pointer pl-2 pr-4 py-1 text-gray-400 hover:bg-slate-900"
                        >
                          Cancel
                        </p>
                      </div>
                    )}
                  </div>
                )}
                <span className="text-xs text-slate-400 mt-1">
                  {msg?.createdAt ? formatTime(msg.createdAt) : ""}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        ref={inputAreaRef}
        className="border-t border-slate-700 p-3 bg-[#0f172e] flex items-end gap-3 relative"
      >
        <button
          onClick={() => fileInputRef.current.click()}
          className="cursor-pointer text-slate-400 hover:text-white"
        >
          <ImageIcon size={22} />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-lg focus:outline-none resize-none overflow-y-auto max-h-40"
          rows={1}
          ref={textareaRef}
          onInput={(e) => {
            const target = e.target;
            target.style.height = "auto";
            target.style.height = `${Math.min(target.scrollHeight, 160)}px`;
          }}
        />

        <button
          onClick={handleSend}
          className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg text-white"
        >
          <Send size={20} />
        </button>
      </div>

      {filePreview && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <div className="relative w-[90%] max-w-md">
            <img
              src={filePreview}
              alt="Preview"
              className="w-full h-auto max-h-[70vh] object-contain rounded-lg border border-slate-700"
            />

            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={handleCancelPreview}
                className="cursor-pointer bg-red-600 hover:bg-red-700 text-white rounded-full p-2"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          <button
            onClick={handleSendImage}
            className="cursor-pointer mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageWindow;
