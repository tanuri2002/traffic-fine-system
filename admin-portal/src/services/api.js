import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchDashboardOverview = () => API.get("/auth/stats/overview");

export const fetchDistrictStatistics = () => API.get("/auth/stats/districts");

export const fetchCategoryBreakdown = () => API.get("/auth/stats/categories");

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default API;