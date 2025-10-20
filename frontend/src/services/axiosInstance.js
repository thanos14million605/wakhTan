import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.evn.MODE === "development" ? "http://localhost:3000" : "/",
  withCredentials: true,
});

export default axiosInstance;
