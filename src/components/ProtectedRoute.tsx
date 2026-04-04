import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
