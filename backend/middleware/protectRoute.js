import User from "../models/userModel.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyToken } from "../utils/jwtHelper.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[0];
  } else {
    token = req.cookies?.jwt;
  }

  if (!token) {
    return next(new AppError("Token not found. Please log in again.", 401));
  }

  const decoded = await verifyToken(token);

  const user = await User.findById(decoded.id).select(
    "+passwordChangedAt -password -role"
  );
  if (!user) {
    return next(
      new AppError("User belonging to this token does not exist anymore.", 401)
    );
  }

  if (
    user.passwordChangedAt &&
    Date.parse(passwordChangedAt) > decoded.id * 1000
  ) {
    return next(
      new AppError("User recently changed password. Please log in again.", 401)
    );
  }

  req.user = user;
  next();
});

export default protectRoute;
