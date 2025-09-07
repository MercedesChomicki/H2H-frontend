// src/services/userService.js
import axios from "axios";
import { USER_SERVICE_URL } from "../config";

export const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(USER_SERVICE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // lista de usuarios [{id, name, email}, ...]
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};