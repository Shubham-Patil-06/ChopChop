import axios from "axios";

const API = axios.create({
  baseURL: "https://chopchop-backend.onrender.com//api/", // change if needed
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("chopchop-token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
