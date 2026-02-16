import axios from "axios";
import logo from "../assets/images/logorr.png";

export const MainContent = {
  name: "E-Commerce-Site",
  logo: logo,
};



export const backendConfig = {
  base: "http://localhost:8000/api",
};

export const Axios = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// 🔹 Request: Har baar latest token lagayega
Axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Response: Agar token expire (401) ho jaye
Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      alert("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export default Axios;
