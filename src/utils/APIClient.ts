import axios from "axios";

const baseURL: string = (import.meta.env.RTCS_API_URL as string) || "http://localhost:8003/api/v1";

const api = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error("Unauthorized! Token may be expired.");
            window.dispatchEvent(new Event("auth-unauthorized"));
        }
        return Promise.reject(error);
    }
);

export default api;