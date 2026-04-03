import { useState } from "react";
import MainLayout from "../layouts/Section.tsx";
import { login } from "../service/AuthService.ts";

export default function LoginPage() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleLogin = async () => {
        try {
            const loginRequest = {
                username,
                password
            };
            const response = await login(loginRequest);
            console.log("Login successful:", response);
        } catch (error) {
            console.error("Login failed:", error);
        }
    }
    return (
        <MainLayout>
            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                <legend className="fieldset-legend">Login</legend>

                <label className="label">Username</label>
                <input
                    type="text"
                    className="input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className="label">Password</label>
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="btn btn-neutral mt-4" onClick={() => void handleLogin()}>Login</button>
            </fieldset>
        </MainLayout>
    )
}