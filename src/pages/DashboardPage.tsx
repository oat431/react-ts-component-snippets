import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MainLayout from "../layouts/Section.tsx";
import { getUserDetail, revokeAccess } from "../service/AuthService.ts";
import { useAuth } from "../context/AuthContext.tsx";
import type { UserDetail } from "../types/Auth.ts";

export default function DashboardPage() {
    const { refreshToken, logout } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState<UserDetail | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await getUserDetail();
                if (response.status === "SUCCESS" && response.data) {
                    setUser(response.data);
                } else {
                    setError(response.error?.message ?? "Failed to load user details.");
                }
            } catch {
                setError("Failed to load user details.");
            } finally {
                setIsLoading(false);
            }
        }
        void fetchUser();
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            if (refreshToken) {
                await revokeAccess({ refresh_token: refreshToken });
            }
        } catch {
            // Even if revoke fails, clear local session
        } finally {
            logout();
            navigate("/login");
        }
    };

    return (
        <MainLayout>
            <div className="card bg-base-100 shadow-xl border border-base-300 w-full max-w-lg mx-auto mt-8">
                <div className="card-body gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="card-title text-2xl">My Profile</h2>
                        <button
                            className="btn btn-error btn-sm"
                            onClick={() => void handleLogout()}
                            disabled={isLoggingOut}
                        >
                            {isLoggingOut
                                ? <span className="loading loading-spinner loading-xs"></span>
                                : "Logout"}
                        </button>
                    </div>

                    {isLoading && (
                        <div className="flex justify-center py-8">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="alert alert-error">{error}</div>
                    )}

                    {user && !isLoading && (
                        <>
                            {/* Avatar */}
                            <div className="flex flex-col items-center gap-3 py-4">
                                <div className="avatar placeholder">
                                    <div className="bg-neutral text-neutral-content w-20 rounded-full text-3xl font-bold">
                                        <span>{user.username.charAt(0).toUpperCase()}</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-semibold">{user.username}</h3>
                                <span className={`badge ${user.is_verified ? "badge-success" : "badge-warning"}`}>
                                    {user.is_verified ? "✓ Verified" : "⚠ Not Verified"}
                                </span>
                            </div>

                            <div className="divider my-0"></div>

                            {/* Info Table */}
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">User ID</span>
                                    <code className="text-sm bg-base-200 px-3 py-2 rounded-lg break-all">{user.id}</code>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Username</span>
                                    <span className="text-sm bg-base-200 px-3 py-2 rounded-lg">{user.username}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Email</span>
                                    <span className="text-sm bg-base-200 px-3 py-2 rounded-lg">{user.email}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs text-base-content/60 uppercase font-semibold tracking-wide">Email Status</span>
                                    <span className="text-sm bg-base-200 px-3 py-2 rounded-lg">
                                        {user.is_verified ? "Verified" : "Pending verification — check your inbox"}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
