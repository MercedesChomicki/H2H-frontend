// src/config.js
const BASE = import.meta.env.VITE_API_BASE_URL;
const HTTP_BASE = `http://${BASE}`;
const WS_BASE = `ws://${BASE}`;

export const USER_SERVICE_URL = `${HTTP_BASE}/users`;
export const PET_SERVICE_URL = `${HTTP_BASE}/pets`;
export const WEBSOCKET_URL = `${WS_BASE}/ws`;