// Common API error shape
export interface ApiError {
    http_code: number;
    error_code: string;
    message: string;
}

// Generic API response wrapper
export interface ApiResponse<T> {
    data: T | null;
    status: "SUCCESS" | "FAIL" | "ERROR";
    error: ApiError | null;
}

// Returned from POST /auth/login
export interface LoginData {
    access_token: string;
    refresh_token: string;
}

// Returned from POST /auth/register and GET /auth/detail
export interface UserDetail {
    id: string;
    username: string;
    email: string;
    is_verified: boolean;
}

// Convenience aliases
export type LoginResponse = ApiResponse<LoginData>;
export type RegisterResponse = ApiResponse<UserDetail>;
export type UserDetailResponse = ApiResponse<UserDetail>;
