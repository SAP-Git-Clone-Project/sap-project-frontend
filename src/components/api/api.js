import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  // baseURL: "http://localhost:5000/api",
});

export const refreshApi = axios.create({
  baseURL: BASE_URL,
  // baseURL: "http://localhost:5000/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    const url = error.config?.url || "";

    if (status === 401) {
      // SECURITY: Add here the routes where this needed
      // NOTE: These endpoints return 401 for wrong password — NOT expired session.
      // IMP: Never log the current admin out because of them.
      const passwordConfirmationEndpoints = [
        "/admin-delete/",
        "/toggle-admin/",
      ];

      const isPasswordConfirmation = passwordConfirmationEndpoints.some(
        (endpoint) => url.includes(endpoint),
      );

      if (isPasswordConfirmation) {
        return Promise.reject(error);
      }

      console.warn("Session invalid or user deleted. Nuking tokens...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      if (window.location.pathname !== "/login") {
        window.location.href = "/login?reason=session_expired";
      }
    } else if (status === 403) {
      console.error("Permission Denied: You don't have clearance for this.");
    }

    return Promise.reject(error);
  },
);

export default api;
