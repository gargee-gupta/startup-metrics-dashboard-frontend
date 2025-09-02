import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

export const metricsApi = {
  getAll: () => API.get("/metrics"),
  add: (data) => API.post("/metrics", data),
  // Future: update and delete
  update: (id, data) => API.put(`/metrics/${id}`, data),
  delete: (id) => API.delete(`/metrics/${id}`),
};

