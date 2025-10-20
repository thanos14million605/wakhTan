import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://wakhtan.onrender.com",
  withCredentials: true,
});

export default axiosInstance;
