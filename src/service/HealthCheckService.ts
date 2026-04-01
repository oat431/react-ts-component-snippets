import api from "../utils/APIClient";

export async function healthCheck(): Promise<unknown> {
    const response = await api.get("/health-check/health");
    return response.data;
}