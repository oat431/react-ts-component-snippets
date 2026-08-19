import { useState } from "react";
import { useNavigate, Link } from "react-router";
import MainLayout from "../layouts/Section.tsx";
import { login as loginService } from "../service/AuthService.ts";
import { useAuth } from "../context/AuthContext.tsx";

interface FieldErrors {
    username?: string;
    password?: string;
}

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = (): boolean => {
        const errors: FieldErrors = {};
        if (!username.trim()) errors.username = "Username is required.";
        if (!password) errors.password = "Password is required.";
        else if (password.length < 8) errors.password = "Password must be at least 8 characters.";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleLogin = async () => {
        if (!validate()) return;

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

                {error && (
                    <div className="alert alert-error text-sm mb-2 py-2" role="alert">
                        {error}
                    </div>
                )}

                <label className="label" htmlFor="login-username">Username</label>
                <input
                    id="login-username"
                    type="text"
                    className={`input ${fieldErrors.username ? "input-error" : ""}`}
                    placeholder="Username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        if (fieldErrors.username) setFieldErrors({ ...fieldErrors, username: undefined });
                    }}
                    disabled={isLoading}
                    autoComplete="username"
                    aria-invalid={!!fieldErrors.username || undefined}
                    aria-describedby={fieldErrors.username ? "login-username-error" : undefined}
                />
                {fieldErrors.username && (
                    <p className="text-error text-xs mt-1" id="login-username-error">
                        {fieldErrors.username}
                    </p>
                )}

                <label className="label" htmlFor="login-password">Password</label>
                <div className="relative">
                    <input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        className={`input input-bordered w-full pr-12 ${fieldErrors.password ? "input-error" : ""}`}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                        }}
                        disabled={isLoading}
                        onKeyDown={(e) => { if (e.key === "Enter") void handleLogin(); }}
                        autoComplete="current-password"
                        aria-invalid={!!fieldErrors.password || undefined}
                        aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
                    />
                    <button
                        type="button"
                        className="btn btn-ghost btn-xs absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide secret" : "Show secret"}
                        aria-pressed={showPassword}
                        disabled={isLoading}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>
                {fieldErrors.password && (
                    <p className="text-error text-xs mt-1" id="login-password-error">
                        {fieldErrors.password}
                    </p>
                )}

                <button
                    className="btn btn-neutral mt-4"
                    onClick={() => void handleLogin()}
                    disabled={isLoading}
                    aria-busy={isLoading || undefined}
                >
                    {isLoading ? <span className="loading loading-spinner"></span> : "Login"}
                </button>

                <p className="text-sm text-center mt-3">
                    Don't have an account?{" "}
                    <Link to="/register" className="link link-primary">Register</Link>
                </p>

                <div className="divider my-1 text-xs">demo mode</div>
                <p className="text-xs text-center text-base-content/60">
                    username: <code>demo</code> · password: <code>password</code>
                </p>
            </fieldset>
        </MainLayout>
    );
}
