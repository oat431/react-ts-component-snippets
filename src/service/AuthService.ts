import api from "../utils/APIClient";
import type { LoginRequest } from "../types/LoginRequest";
import type { AuthResponse } from "../types/Auth";

export async function login(loginRequest: LoginRequest): Promise<AuthResponse> {
    const response = await api.post("/auth/login", loginRequest);
    return response.data;
}