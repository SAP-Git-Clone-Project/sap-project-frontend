import axios from "axios";

const api = axios.create({
  baseURL: "https://sap-project-backend-2acs.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

export const refreshApi = axios.create({
  baseURL: "https://sap-project-backend-2acs.onrender.com/api",
  // baseURL: "http://localhost:5000/api",
});

export default api;
