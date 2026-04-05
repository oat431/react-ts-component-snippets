import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface AuthContextType {
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);

    // Initialize from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("jwt_token");
        const storedRefreshToken = localStorage.getItem("refresh_token");
        if (storedToken) setToken(storedToken);
        if (storedRefreshToken) setRefreshToken(storedRefreshToken);
    }, []);

    const login = (accessToken: string, newRefreshToken: string) => {
        setToken(accessToken);
        setRefreshToken(newRefreshToken);
        localStorage.setItem("jwt_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);
    };

    const logout = useCallback(() => {
        setToken(null);
        setRefreshToken(null);
        localStorage.removeItem("jwt_token");
        localStorage.removeItem("refresh_token");
    }, []);

    // Auto-logout when the API client fires a 401 event
    useEffect(() => {
        const handleUnauthorized = () => logout();
        window.addEventListener("auth-unauthorized", handleUnauthorized);
        return () => window.removeEventListener("auth-unauthorized", handleUnauthorized);
    }, [logout]);

    return (
        <AuthContext.Provider value={{ token, refreshToken, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
