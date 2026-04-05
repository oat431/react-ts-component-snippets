import api from "../utils/APIClient";
import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import type { RevokeRequest } from "../types/RevokeRequest";
import type {
    LoginResponse,
    RegisterResponse,
    UserDetailResponse,
    ApiResponse,
} from "../types/Auth";

// POST /auth/login
export async function login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", loginRequest);
    return response.data;
}

// POST /auth/register
export async function register(registerRequest: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>("/auth/register", registerRequest);
    return response.data;
}

// GET /auth/detail  (requires Bearer token — handled by APIClient interceptor)
export async function getUserDetail(): Promise<UserDetailResponse> {
    const response = await api.get<UserDetailResponse>("/auth/detail");
    return response.data;
}

// POST /auth/revoke
export async function revokeAccess(revokeRequest: RevokeRequest): Promise<ApiResponse<string>> {
    const response = await api.post<ApiResponse<string>>("/auth/revoke", revokeRequest);
    return response.data;
}

// GET /auth/verify-email?token=...
export async function verifyEmail(token: string): Promise<ApiResponse<string>> {
    const response = await api.get<ApiResponse<string>>("/auth/verify-email", {
        params: { token },
    });
    return response.data;
}