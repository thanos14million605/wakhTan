import React, { useState } from "react";
import { Link } from "react-router-dom";

import { FaUser, FaUserTie } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import toast from "react-hot-toast";

import Navbar from "../ui/Navbar";
import useAuthStore from "../store/useAuthStore";
import SubmissionLoadingIndicator from "../ui/SubmissionLoadingIndicator";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, userName, email, confirmPassword, password } = formData;
    if (!fullName || !userName || !email || !password || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }

    if (password.length < 8 || confirmPassword.length < 8) {
      toast.error("Password must be at least 8 character.");
      return;
    }
    const { status, message } = await signup(formData);

    if (status === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }

    setFormData({
      fullName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a1122] text-white">
      <Navbar />
      <div className="mt-10 flex items-center justify-center">
        <div className="w-full md:w-[40%] lg:w-[35%] bg-[#0f172e] md:rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-amber-500 font-bold tracking-wide text-2xl md:text-3xl text-center">
            Create Account
          </h2>
          <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-300 text-center">
            Get started with your free account
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col space-y-5"
          >
            <div className="relative w-full">
              <FaUserTie className="absolute z-10 top-4 left-3 text-gray-400" />
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Given Names"
                className="px-10 w-full bg-slate-800 py-3 outline-none text-amber-100 rounded-lg placeholder:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div className="relative w-full">
              <FaUser className="absolute z-10 top-4 left-3 text-gray-400" />
              <input
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="Username (e.g. mose20@)"
                className="px-10 w-full bg-slate-800 py-3 outline-none text-amber-100 rounded-lg placeholder:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div className="relative w-full">
              <MdEmail className="absolute z-10 top-4 left-3 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email"
                className="px-10 w-full bg-slate-800 py-3 outline-none text-amber-100 rounded-lg placeholder:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div className="relative w-full">
              <RiLockPasswordLine className="absolute z-10 top-4 left-3 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className="px-10 w-full bg-slate-800 py-3 outline-none text-amber-100 rounded-lg placeholder:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 transition"
                onBlur={() => setShowPassword(false)}
              />
              {!showPassword ? (
                <IoMdEye
                  onClick={() => setShowPassword((show) => !show)}
                  className="absolute cursor-pointer z-10 top-4 right-3 text-gray-400"
                />
              ) : (
                <IoMdEyeOff
                  onClick={() => setShowPassword((show) => !show)}
                  className="cursor-pointer absolute z-10 top-4 right-3 text-gray-400"
                />
              )}
            </div>

            <div className="relative w-full">
              <RiLockPasswordLine className="absolute z-10 top-4 left-3 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                placeholder="Confirm Password"
                className="px-10 w-full bg-slate-800 py-3 outline-none text-amber-100 rounded-lg placeholder:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 transition"
                onBlur={() => setShowConfirmPassword(false)}
              />
              {!showConfirmPassword ? (
                <IoMdEye
                  onClick={() => setShowConfirmPassword((show) => !show)}
                  className="absolute cursor-pointer z-10 top-4 right-3 text-gray-400"
                />
              ) : (
                <IoMdEyeOff
                  onClick={() => setShowConfirmPassword((show) => !show)}
                  className="cursor-pointer absolute z-10 top-4 right-3 text-gray-400"
                />
              )}
            </div>

            <button
              type="submit"
              className="cursor-pointer mt-4 w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              {isSigningUp ? <SubmissionLoadingIndicator /> : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
