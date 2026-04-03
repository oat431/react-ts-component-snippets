import api from "../utils/APIClient";
import type { LoginRequest } from "../types/LoginRequest";

export async function login(loginRequest: LoginRequest): Promise<unknown> {
    const response = await api.post("/auth/login", loginRequest);
    return response.data;
}