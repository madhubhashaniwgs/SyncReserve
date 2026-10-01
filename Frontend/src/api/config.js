const configuredApiUrl = import.meta.env.VITE_API_URL;

export const API_BASE_URL = configuredApiUrl || "http://localhost:8080/api";
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "");
