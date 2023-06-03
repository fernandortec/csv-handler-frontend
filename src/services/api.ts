import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
});
