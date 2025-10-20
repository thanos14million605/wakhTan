import React from "react";
import useContacts from "./../../hooks/useContacts";
import useGetContacts from "./../contacts/hooks/useGetContacts";
import useAuthStore from "../../store/useAuthStore";
import Skeleton from "react-loading-skeleton";
import { FaUser } from "react-icons/fa";
import useSocket from "../../hooks/useSocket";

const ChatList = () => {
  const {
    selectedContactId,
    onSelectContact,

    onSelectContactUserName,
  } = useContacts();
  const { contacts, isFetchingContacts } = useGetContacts();
  const { authUser } = useAuthStore();
  const { onlineUsers } = useSocket(authUser?._id);

  const onlineUsersId = onlineUsers.map((onlineUser) => onlineUser._id);

  return (
    <div className="h-full overflow-y-auto bg-[#0f172e] border-r border-slate-800">
      <h2 className="text-lg font-semibold px-4 py-3 border-b border-slate-700">
        Chats
      </h2>
      {isFetchingContacts ? (
        <Skeleton count={2} />
      ) : (
        <ul className="divide-y divide-slate-800">
          {contacts.map((contact, idx) => (
            <li
              key={contact._id || idx}
              onClick={() => {
                onSelectContact(contact._id);
                onSelectContactUserName(contact.userName);
              }}
              className={`px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-slate-800 ${
                selectedContactId === contact._id ? "bg-slate-800" : ""
              }`}
            >
              <div className="relative flex flex-row items-center gap-4">
                <div className="relative z-0 border-[1.5px] border-gray-500 bg-slate-800 h-[50px] w-[50px] md:h-[63px] md:w-[63px] rounded-full flex items-center justify-center overflow-hidden">
                  {!contact?.profilePicUrl ? (
                    <p className="text-amber-400 text-lg md:text-xl">
                      <FaUser />
                    </p>
                  ) : (
                    <img
                      src={contact.profilePicUrl}
                      alt={contact.userName}
                      className="object-cover w-full h-full rounded-full"
                    />
                  )}
                </div>
                {onlineUsersId.includes(contact._id) ? (
                  <div className="h-[7px] w-[7px] md:h-[9px] md:w-[9px] rounded-full bg-green-500 absolute z-30 top-10 left-9 md:top-13 md:left-11"></div>
                ) : null}

                <div className="flex flex-col">
                  <p className="font-medium">{contact.fullName}</p>
                  {contact.lastMessage ? (
                    <p
                      className={`text-sm ${
                        contact.lastMessage.senderId === authUser._id
                          ? "text-slate-500"
                          : "text-green-500"
                      }  truncate max-w-[140px]`}
                    >
                      {contact.lastMessage.text || "📷 Image"}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500">No messages yet</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end">
                {contact.lastMessage && (
                  <span className="text-xs text-slate-400">
                    {new Date(contact.lastMessage.createdAt).toLocaleTimeString(
                      [],
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
