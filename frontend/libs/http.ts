import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:9999",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default client;
