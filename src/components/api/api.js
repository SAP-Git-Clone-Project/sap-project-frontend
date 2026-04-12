import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: "https://sap-project-backend-2acs.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

export const refreshApi = axios.create({
  baseURL: "https://sap-project-backend-2acs.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const url = error.config?.url || "";

    if (status === 401) {
      // Skip logout for admin-delete — 401 there means wrong password, not expired session
      if (url.includes("/admin-delete/")) {
        return Promise.reject(error);
      }

      console.warn("Session invalid or user deleted. Nuking tokens...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=session_expired";
      }
    }

    else if (status === 403) {
      console.error("Permission Denied: You don't have clearance for this.");
    }

    return Promise.reject(error);
  }
);

export default api;
