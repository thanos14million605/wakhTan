import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import toast from "react-hot-toast";

import useAuthStore from "../store/useAuthStore";

import Navbar from "../ui/Navbar";
import SubmissionLoadingIndicator from "../ui/SubmissionLoadingIndicator";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { login, isLoggingIn, isAuthenticated, authUser } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      toast.error("All fields are required.");
      return;
    }

    const { status, message } = await login(formData);

    if (status === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }

    setFormData({
      email: "",
      password: "",
    });
  };

  useEffect(() => {
    if (isAuthenticated)
      navigate(`/chats/${authUser?.userName}`, { replace: true });
  }, [isAuthenticated, navigate, authUser]);

  return (
    <div className="min-h-screen bg-[#0a1122] text-white">
      <Navbar />
      <div className="mt-10 flex items-center justify-center">
        <div className="w-full md:w-[40%] lg:w-[35%] bg-[#0f172e] md:rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-amber-500 font-bold tracking-wide text-2xl md:text-3xl text-center">
            Wahal Saa Wakh
          </h2>
          <p className="mt-2 md:mt-3 text-base md:text-lg text-gray-300 text-center">
            Login to continue chatting with friends
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col space-y-5"
          >
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
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
                className="px-10 w-full bg-slate-800 py-3 outline-none text-amber-100 rounded-lg placeholder:text-base placeholder:text-gray-400 focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer mt-4 w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              {isLoggingIn ? <SubmissionLoadingIndicator /> : "Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
