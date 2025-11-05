import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://coedev.smartbuildinginspection.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const userdata = JSON.parse(sessionStorage.getItem("userdata"));
    const token = userdata.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
