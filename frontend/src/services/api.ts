import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

api.interceptors.request.use((config) => {
  if (config.method === "get") {
    config.params = config.params || {};
    config.params["_t"] = Date.now();
  }
  return config;
});
