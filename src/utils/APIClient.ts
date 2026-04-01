import axios from "axios";

const baseURL: string = (import.meta.env.RTCS_API_URL as string) || "http://localhost:8003/api/v1";

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;