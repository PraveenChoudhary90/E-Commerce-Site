import axios from "axios";
import logo from "../assets/images/logoe.png";

export const MainContent = {
  name: "E-Commerce-Site",
  logo: logo,
};
export const backendConfig = {
  base: "http://localhost:8000/api"
};

const token = localStorage.getItem("token");
export const Axios = axios.create({
  baseURL:"http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


