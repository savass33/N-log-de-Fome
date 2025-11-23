import axios from "axios";

// DAO BASE: Configuração da conexão HTTP
export const api = axios.create({
  baseURL: "http://localhost:3001/api",
  headers: {
    // --- ANTI-CACHE: Força dados frescos sempre ---
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

// Interceptor opcional para garantir que cada request seja única (Cache Busting via URL)
api.interceptors.request.use((config) => {
  if (config.method === "get") {
    config.params = config.params || {};
    config.params["_t"] = Date.now(); // Adiciona ?_t=123456 na URL
  }
  return config;
});
