import User from "../models/userModel.js";
import AppError from "./../utils/AppError.js";
import asyncHander from "./../utils/asyncHandler.js";
import { signToken, verifyToken } from "./../utils/jwtHelper.js";
import { isPasswordCorrect } from "../utils/bcryptHelper.js";

const login = asyncHander(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("All fields are required.", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const isMatch = await isPasswordCorrect(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials.", 401));
  }

  const token = await signToken(user._id);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    message: "Logged in successfully.",
    token,
    data: {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userName: user.userName,
        profilePicUrl: user.profilePicUrl,
      },
    },
  });
});

const signup = asyncHander(async (req, res, next) => {
  const { fullName, userName, email, password, confirmPassword } = req.body;

  const isExistingUser = await User.findOne({ email });
  if (isExistingUser) {
    return next(new AppError("User already exits. Please sign in.", 400));
  }

  const newUser = await User.create({
    fullName,
    userName,
    email,
    password,
    confirmPassword,
  });

  if (!newUser) {
    return next(
      new AppError("Server couldn't create user. Please try again later.", 500)
    );
  }

  const io = req.app.get("io");
  io.emit("newUserJoined", newUser.fullName);

  res.status(201).json({
    status: "success",
    message: "Account created successfuly. Please sign in.",
    data: {
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      userName: newUser.userName,
    },
  });
});

const logout = asyncHander(async (req, res, next) => {
  res.clearCookie("jwt", {
    maxAge: 0,
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

const checkAuth = asyncHander(async (req, res, next) => {
  const user = await User.findById(req.user._id).select(
    "-password -role -profilePicPublicId -passwordChangedAt"
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
  login,
  signup,
  logout,
  checkAuth,
};
