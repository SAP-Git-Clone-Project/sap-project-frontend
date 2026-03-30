import axios from "axios";

const api = axios.create({
  baseURL: "https://sap-project-backend-2acs.onrender.com/api",
});

export const refreshApi = axios.create({
  baseURL: "https://sap-project-backend-2acs.onrender.com/api",
});

export default api;
