// import React, { useEffect } from "react";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BsChatHeartFill } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import useAuthStore from "../store/useAuthStore";
import SubmissionLoadingIndicator from "./SubmissionLoadingIndicator";
import toast from "react-hot-toast";
import socket from "../socket/socket";
import { useQueryClient } from "@tanstack/react-query";

const Navbar = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isLoggingOut, authUser, isAuthenticated } = useAuthStore();

  const handleLogout = async () => {
    const { message, status } = await logout();
    queryClient.clear();
    socket.disconnect();
    navigate("/login");
    if (status === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  if (isLoggingOut) return <SubmissionLoadingIndicator />;

  return (
    <div className="h-[60px] md:h-[70px] bg-slate-700">
      <div className="mx-3 md:mx-10 h-full flex items-center justify-between">
        <div className="flex gap-3 h-full items-center">
          <BsChatHeartFill className="text-4xl text-amber-200" />
          <h1 className="text-xl md:text-2xl text-amber-400 font-bold">
            wakhTan
          </h1>
        </div>
        {isAuthenticated ? (
          <div className="h-full flex gap-7 justify-center items-center">
            {location.pathname == `/chats/${authUser?.userName}` ? (
              <Link
                to={`/profile/${authUser?.userName}/${authUser?._id}`}
                className="h-full flex flex-col gap-1 justify-center items-center"
              >
                <FaUser className="text-2xl text-white cursor-pointer" />
                <p className="text-amber-400 cursor-pointer text-md font-semibold">
                  {authUser?.userName}
                </p>
              </Link>
            ) : (
              <Link
                to={`/chats/${authUser.userName}`}
                className="h-full flex flex-col gap-1 justify-center items-center"
              >
                <BsChatHeartFill className="text-2xl text-white cursor-pointer" />
                <p className="text-amber-400 cursor-pointer text-md font-semibold">
                  Chats
                </p>
              </Link>
            )}
            <FiLogOut
              onClick={handleLogout}
              className="text-orange-500 text-2xl font-bold cursor-pointer"
            />
          </div>
        ) : (
          <FaUser className="text-2xl text-white cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default Navbar;
