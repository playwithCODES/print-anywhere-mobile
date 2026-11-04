
import axios from "axios";

import apiConfig from "@/constants/api";

const api = axios.create({
  baseURL: apiConfig.API_BASE_URL,
  timeout: 30000,
});

export default api;
