import { create } from "zustand";
import axiosInstance from "../services/axiosInstance";
import socket from "../socket/socket";

const useAuthStore = create((set) => ({
  authUser: null,

  isAuthenticated: false,

  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,
  isUpdatingProfile: false,

  isCheckingAuth: true,

  token: null,

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/api/v1/auth/check");

      set(() => {
        return {
          authUser: data.data.user,
          isAuthenticated: true,
        };
      });
    } catch (err) {
      // Only handle unexpected errors
      if (err.response && err.response.status === 401) {
        // Normal case: user not logged in
        set(() => ({
          authUser: null,
          isAuthenticated: false,
        }));
      } else {
        console.warn("Unexpected error during auth check:", err.message);
      }
    } finally {
      set(() => {
        return {
          isCheckingAuth: false,
        };
      });
    }
  },
  signup: async (formData) => {
    set(() => ({ isSigningUp: true }));
    try {
      const { data } = await axiosInstance.post(
        "/api/v1/auth/signup",
        formData
      );

      return {
        status: data.status,
        message: data.message,
      };
    } catch (err) {
      const { data } = err.response;
      return {
        status: data.status,
        message: data.message,
      };
    } finally {
      set(() => ({ isSigningUp: false }));
    }
  },
  login: async (formData) => {
    set(() => ({ isLoggingIn: true }));
    try {
      const { data } = await axiosInstance.post("/api/v1/auth/login", formData);

      set(() => ({
        authUser: data.data.user,
        isAuthenticated: true,
        token: data.token,
      }));
      return {
        status: data.status,
        message: data.message,
      };
    } catch (err) {
      const { data } = err.response;
      return {
        status: data.status,
        message: data.message,
      };
    } finally {
      set(() => ({ isLoggingIn: false }));
    }
  },

  logout: async () => {
    set(() => ({ isLoggingOut: true }));
    try {
      const { data } = await axiosInstance.post("/api/v1/auth/logout");

      if (socket.connected) socket.disconnect();

      set(() => ({
        authUser: null,
        isAuthenticated: false,
        token: null,
      }));
      return {
        status: data.status,
        message: data.message,
      };
    } catch (err) {
      const { data } = err.response;
      return {
        status: data.status,
        message: data.message,
      };
    } finally {
      set(() => ({ isLoggingOut: false }));
    }
  },
}));

export default useAuthStore;
