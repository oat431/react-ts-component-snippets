import { useState } from "react";
import { useNavigate, Link } from "react-router";
import MainLayout from "../layouts/Section.tsx";
import { login as loginService } from "../service/AuthService.ts";
import { useAuth } from "../context/AuthContext.tsx";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await loginService({ username, password });

            if (response.status === "SUCCESS" && response.data) {
                login(response.data.access_token, response.data.refresh_token);
                navigate("/dashboard");
            } else {
                setError(response.error?.message ?? "Login succeeded but no token was returned.");
            }
        } catch (err: unknown) {
            console.error("Login failed:", err);
            setError("Invalid username or password.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs text-left border p-4">
                <legend className="fieldset-legend">Login</legend>

                {error && <div className="alert alert-error text-sm mb-2 py-2">{error}</div>}

                <label className="label">Username</label>
                <input
                    type="text"
                    className="input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                />

                <label className="label">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    onKeyDown={(e) => { if (e.key === "Enter") void handleLogin(); }}
                />

                <button
                    className="btn btn-neutral mt-4"
                    onClick={() => void handleLogin()}
                    disabled={isLoading}
                >
                    {isLoading ? <span className="loading loading-spinner"></span> : "Login"}
                </button>

                <p className="text-sm text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/register" className="link link-primary">Register</Link>
                </p>
            </fieldset>
        </MainLayout>
    );
}