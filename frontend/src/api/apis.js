import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/", // change if needed
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("chopchop-token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
