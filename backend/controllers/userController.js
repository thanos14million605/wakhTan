import User from "../models/userModel.js";
import AppError from "./../utils/AppError.js";
import asyncHander from "./../utils/asyncHandler.js";
import cloudinary from "./../utils/cloudinary.js";

const updateProfile = asyncHander(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "+profilePicPublicId +profilePicUrl"
  );

  const { profilePic, newUsername } = req.body;

  if (!profilePic && !newUsername) {
    return next(
      new AppError("Please attach a profile photo or update username.", 400)
    );
  }

  if (!profilePic && newUsername) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      { userName: newUsername },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        updatedUser,
      },
    });
  }

  if (user.profilePicPublicId) {
    await cloudinary.uploader.destroy(user.profilePicPublicId);
  }

  const result = await cloudinary.uploader.upload(profilePic, {
    folder: "wakhtan/users/profile-photos",
    public_id: `profile-photos-${user._id}`,
    overwrite: true,

    transformation: [{ quality: "auto" }, { fetch_format: "auto" }],
  });

  user.profilePicUrl = result.secure_url;
  user.profilePicPublicId = result.public_id;

  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Profile updated successfully.",
    data: {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userName: user.userName,
      profilePicUrl: user.profilePicUrl,
    },
  });
});

const getMe = asyncHander(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -role -profilePicPublicId -passwordChangedAt +profilePicUrl"
  );
  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

export default {
  updateProfile,
  getMe,
};
