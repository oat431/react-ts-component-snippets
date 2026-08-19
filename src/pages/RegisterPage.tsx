import { useState } from "react";
import { useNavigate, Link } from "react-router";
import MainLayout from "../layouts/Section.tsx";
import { register as registerService } from "../service/AuthService.ts";

export default function RegisterPage() {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const navigate = useNavigate();

    const handleRegister = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await registerService({ username, email, password });

            if (response.status === "SUCCESS" && response.data) {
                setSuccessMessage(
                    `Account created! A verification email has been sent to ${response.data.email}. Redirecting to login...`
                );
                setTimeout(() => { void navigate("/login"); }, 3000);
            } else {
                setError(response.error?.message ?? "Registration failed. Please try again.");
            }
        } catch (err: unknown) {
            console.error("Register failed:", err);
            setError("Registration failed. Username or email may already be taken.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <MainLayout>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs text-left border p-4">
                <legend className="fieldset-legend">Create Account</legend>

                {error && (
                    <div className="alert alert-error text-sm mb-2 py-2">{error}</div>
                )}
                {successMessage && (
                    <div className="alert alert-success text-sm mb-2 py-2">{successMessage}</div>
                )}

                <label className="label" htmlFor="register-username">Username</label>
                <input
                    id="register-username"
                    type="text"
                    className="input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading || !!successMessage}
                    autoComplete="username"
                />

                <label className="label" htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading || !!successMessage}
                    autoComplete="email"
                />

                <label className="label" htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading || !!successMessage}
                    onKeyDown={(e) => { if (e.key === "Enter") void handleRegister(); }}
                />

                <button
                    className="btn btn-neutral mt-4"
                    onClick={() => void handleRegister()}
                    disabled={isLoading || !!successMessage}
                >
                    {isLoading ? <span className="loading loading-spinner"></span> : "Register"}
                </button>

                <p className="text-sm text-center mt-3">
                    Already have an account?{" "}
                    <Link to="/login" className="link link-primary">Login</Link>
                </p>
            </fieldset>
        </MainLayout>
    );
}
