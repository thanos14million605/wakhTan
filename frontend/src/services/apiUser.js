import axiosInstance from "./axiosInstance";

const getMe = async () => {
  const res = await axiosInstance.get("api/v1/users/me");
  return res.data.data.user;
};

const updateProfile = async (profilePic, newUsername) => {
  const res = await axiosInstance.patch("/api/v1/users/update-profile", {
    profilePic,
    newUsername,
  });

  return res.data.data.updatedUser;
};
export { getMe, updateProfile };
