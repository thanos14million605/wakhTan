import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";

import { FaCamera } from "react-icons/fa";
import { MdEdit, MdSave } from "react-icons/md";
import Navbar from "../ui/Navbar";
// import useAuthStore from "../store/useAuthStore";
import useGetMe from "../features/profile/hooks/useGetMe";
import useUpdateMe from "../features/profile/hooks/useUpdateMe";
import { formatDate } from "../utils/dateFormatter";

const ProfilePage = () => {
  // const { authUser } = useAuthStore();
  const { isGettingMe, me } = useGetMe();
  const { updateProfileMutate } = useUpdateMe();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(me?.userName || "");
  const [profilePreview, setProfilePreview] = useState(null);

  const fileInputRef = useRef(null);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleSave = async () => {
    if (username === "") {
      toast.error("Username can't be blank.");
      return;
    }
    updateProfileMutate({ newUsername: username });
    setIsEditing(false);
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfilePreview(reader.result); // show preview immediately
    };

    reader.onloadend = () => {
      const base64String = reader.result;
      setProfilePreview(base64String);

      updateProfileMutate({ profilePic: base64String });
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (me?.userName) {
      setUsername(me.userName);
    }
  }, [me]);

  return (
    <div className="min-h-screen bg-[#0a1122] text-white">
      <Navbar />

      <div className="mx-auto mt-4 w-full md:w-[45%] bg-[#0f172e] md:rounded-2xl shadow-lg p-4 md:p-6">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="text-center">
            <h3 className="mb-1 font-semibold text-amber-500 text-xl md:text-2xl">
              {me?.userName}
            </h3>
          </div>

          {/* Profile Image */}
          <div className="relative flex flex-col items-center">
            <div className="relative border-[1.5px] border-gray-500 bg-slate-800 h-[95px] w-[95px] md:h-[110px] md:w-[110px] rounded-full flex items-center justify-center overflow-hidden">
              {profilePreview && (
                <img
                  src={profilePreview}
                  alt="Profile Preview"
                  className="object-cover w-full h-full rounded-full"
                />
              )}
              {!me?.profilePicUrl && !profilePreview && (
                <p className="text-amber-400 text-2xl md:text-3xl">
                  {me?.fullName?.split(" ")?.[0]?.[0]}
                </p>
              )}

              {me?.profilePicUrl && !profilePreview && (
                <img
                  src={me?.profilePicUrl}
                  alt={me?.userName}
                  className="object-cover w-full h-full rounded-full"
                />
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="z-10 hidden"
                onChange={handleImageChange}
              />

              {/* Camera icon */}
            </div>
            <FaCamera
              onClick={handleCameraClick}
              className="absolute z-20 top-18 left-55 md:left-64 text-2xl text-amber-400 cursor-pointer hover:scale-110 transition-transform"
            />
            <p className="mt-1 text-gray-500 text-md md:text-lg text-center">
              Click the camera icon to set or update your profile photo
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="mt-8 flex flex-col gap-4">
          {/* Full Name */}
          <div className="flex flex-col w-full gap-2">
            <p className="text-gray-500 text-md font-bold">Full Name</p>
            <input
              type="text"
              value={me?.fullName}
              readOnly
              className="px-4 w-full bg-slate-800 py-2 md:py-3 text-gray-400 rounded-lg text-md md:text-lg border-2 border-amber-500 cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col w-full gap-2">
            <p className="text-gray-500 text-md font-bold">Email Address</p>
            <input
              type="text"
              value={me?.email}
              readOnly
              className="px-4 w-full bg-slate-800 py-2 md:py-3 text-gray-400 rounded-lg text-md md:text-lg border-2 border-amber-500 cursor-not-allowed"
            />
          </div>

          {/* Username */}
          <div className="relative flex flex-col w-full gap-2">
            <p className="text-gray-500 text-md font-bold">Username</p>
            {isEditing ? (
              <MdSave
                className="text-green-400 cursor-pointer text-xl md:text-2xl absolute bottom-3 md:bottom-4 left-[93%]"
                onClick={handleSave}
              />
            ) : (
              <MdEdit
                className="text-amber-200 cursor-pointer text-xl md:text-2xl absolute bottom-3 md:bottom-4 left-[93%]"
                onClick={handleEditToggle}
              />
            )}
            {isGettingMe ? (
              <Skeleton />
            ) : (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={handleSave}
                readOnly={!isEditing}
                className={`px-4 w-full bg-slate-800 py-2 md:py-3 outline-none text-gray-200 rounded-lg text-md md:text-lg placeholder:text-gray-400 border-2 ${
                  isEditing ? "border-amber-500" : "border-slate-700"
                } ${!isEditing ? "cursor-not-allowed text-gray-400" : ""}`}
              />
            )}
          </div>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="mx-auto mt-4 w-full md:w-[45%] bg-[#0f172e] md:rounded-2xl shadow-lg p-4 md:p-6">
        <p className="mb-3 text-xl md:text-2xl text-amber-500 font-semibold">
          Account Information
        </p>
        <div className="py-3 border-b-[1.75px] border-b-amber-500 flex justify-between items-center">
          <p className="text-gray-500 text-lg md:text-xl">Member since</p>
          <p className="text-gray-400 text-md md:text-lg">
            {formatDate(new Date(me?.createdAt || new Date()))}
          </p>
        </div>
        <div className="py-2 flex justify-between items-center">
          <p className="text-gray-500 text-lg md:text-xl">Account status</p>
          <p className="text-green-400 text-md md:text-lg">Active</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
