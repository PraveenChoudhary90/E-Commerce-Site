import axios from "axios";
import logo from "../assets/images/logo.png";

export const MainContent = {
  name: "Bionova",
  logo: logo,
};
export const backendConfig = {
  // base: "http://192.168.29.191:8080/api",
  // origin: "http://192.168.29.191:8080",
  // base: "http://172.20.10.2:8080/api",
  // origin: "http://172.20.10.2:8080",
  // origin: "https://api.bionova.ai",
  base: "http://localhost:5000/api/v1",
  // base: "https://api.bionova.ai/api",
  // origin: "https://api.bionova.ai",
    //  base: "http://localhost:8000",


};

const token = localStorage.getItem("token");
export const Axios = axios.create({
  baseURL:"http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});


