import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://chopchop-0ixd.onrender.com/api/",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("chopchop-token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
