// src/config.js
const HTTP_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const USER_SERVICE_URL = `${HTTP_BASE}/users`;
export const PET_SERVICE_URL = `${HTTP_BASE}/pets`;
export const CHAT_WS_URL = `${WS_BASE}/ws`;