import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Test harness: expose context values through a probe component
function AuthProbe() {
    const { token, isAuthenticated, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="authenticated">{String(isAuthenticated)}</span>
            <span data-testid="token">{token ?? "none"}</span>
            <button onClick={() => login("tok-abc", "ref-abc")}>do-login</button>
            <button onClick={logout}>do-logout</button>
        </div>
    );
}

function renderAuth() {
    return render(
        <AuthProvider>
            <AuthProbe />
        </AuthProvider>,
    );
}

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("starts unauthenticated", () => {
        renderAuth();
        expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
    });

    it("login stores tokens in state AND localStorage", async () => {
        const user = (await import("@testing-library/user-event")).default.setup();
        renderAuth();

        await user.click(screen.getByText("do-login"));

        expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
        expect(screen.getByTestId("token")).toHaveTextContent("tok-abc");
        expect(localStorage.getItem("jwt_token")).toBe("tok-abc");
        expect(localStorage.getItem("refresh_token")).toBe("ref-abc");
    });

    it("restores session from localStorage on mount", () => {
        localStorage.setItem("jwt_token", "restored-token");
        localStorage.setItem("refresh_token", "restored-refresh");

        renderAuth();

        // the mount effect reads storage into state
        expect(screen.getByTestId("token")).toHaveTextContent("restored-token");
        expect(screen.getByTestId("authenticated")).toHaveTextContent("true");
    });

    it("logout clears state AND storage", async () => {
        const user = (await import("@testing-library/user-event")).default.setup();
        localStorage.setItem("jwt_token", "x");
        localStorage.setItem("refresh_token", "y");
        renderAuth();

        await user.click(screen.getByText("do-logout"));

        expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
        expect(localStorage.getItem("jwt_token")).toBeNull();
    });

    it("auto-logs-out when the API client fires a 401 event (interceptor contract)", async () => {
        localStorage.setItem("jwt_token", "expired-token");
        localStorage.setItem("refresh_token", "expired-refresh");
        renderAuth();

        // The axios response interceptor dispatches this event on any 401 —
        // AuthContext listens and force-logs-out. This is the contract that
        // ties APIClient.ts and AuthContext.tsx together.
        await act(async () => {
            window.dispatchEvent(new Event("auth-unauthorized"));
        });

        expect(screen.getByTestId("authenticated")).toHaveTextContent("false");
        expect(localStorage.getItem("jwt_token")).toBeNull();
    });

    it("useAuth outside a provider throws a helpful error", () => {
        // silence React's error boundary noise
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});
        expect(() => render(<BadConsumer />)).toThrow(/useAuth must be used within an AuthProvider/);
        spy.mockRestore();
    });
});

function BadConsumer() {
    useAuth();
    return null;
}
