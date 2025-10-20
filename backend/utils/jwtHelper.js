import jwt from "jsonwebtoken";
import { promisify } from "util";

const signToken = async (userId) => {
  return await jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_SECRET_EXPIRES_IN,
  });
};

const verifyToken = async (token) => {
  return await promisify(jwt.verify)(token, process.env.JWT_SECRET);
};

export { signToken, verifyToken };
