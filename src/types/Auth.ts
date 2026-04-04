export interface AuthData {
    access_token: string;
    refresh_token?: string;
}

export interface AuthResponse {
    data: AuthData | null;
    error: any;
    status: string;
}
