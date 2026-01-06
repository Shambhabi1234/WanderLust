import axios from "axios";

const api = axios.create({
  // 👇 UPDATE THIS LINE WITH YOUR RENDER URL
  baseURL: "https://wanderlust-uixv.onrender.com/api", 
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Keep your interceptors as they are
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default api;