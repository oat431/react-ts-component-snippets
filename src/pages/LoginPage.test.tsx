import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "../test/utils";

// Behavior-first: query by role/label (what a user sees), never by testid.
// Network is mocked by MSW (setup.ts) — the real axios service runs.
// Full provider stack via renderWithProviders (NavBar's CartBadge needs the store).

function renderLogin() {
    return renderWithProviders(<LoginPage />, { route: "/login" });
}

describe("LoginPage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("renders an accessible form (labels associated, submit present)", () => {
        renderLogin();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("blocks submit and shows field errors for empty fields", async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        // no API call happened — no form-level error from the server
        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("shows field error for short password", async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByLabelText(/username/i), "demo");
        await user.type(screen.getByLabelText(/password/i), "short");
        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(await screen.findByText(/at least 8 characters/i)).toBeInTheDocument();
    });

    it("flags invalid fields with aria-invalid for assistive tech", async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.click(screen.getByRole("button", { name: /login/i }));

        expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/username/i)).toHaveAttribute("aria-invalid", "true");
    });

    it("rejects wrong credentials with an alert (MSW mock, real axios client)", async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByLabelText(/username/i), "demo");
        await user.type(screen.getByLabelText(/password/i), "wrongpass");
        await user.click(screen.getByRole("button", { name: /login/i }));

        // MSW returns the API envelope error → form-level alert
        expect(await screen.findByRole("alert")).toHaveTextContent(/invalid username or password/i);
    });

    it("logs in with demo credentials: stores tokens", async () => {
        const user = userEvent.setup();
        renderLogin();

        await user.type(screen.getByLabelText(/username/i), "demo");
        await user.type(screen.getByLabelText(/password/i), "password");
        await user.click(screen.getByRole("button", { name: /login/i }));

        // AuthContext persists tokens on success
        await screen.findByRole("button", { name: /login/i }); // form settles
        expect(localStorage.getItem("jwt_token")).toContain("demo");
        expect(localStorage.getItem("refresh_token")).toBe("demo-refresh-token");
    });

    it("toggles password visibility", async () => {
        const user = userEvent.setup();
        renderLogin();

        const passwordInput = screen.getByLabelText(/password/i);
        expect(passwordInput).toHaveAttribute("type", "password");

        await user.click(screen.getByRole("button", { name: /show secret/i }));
        expect(passwordInput).toHaveAttribute("type", "text");

        await user.click(screen.getByRole("button", { name: /hide secret/i }));
        expect(passwordInput).toHaveAttribute("type", "password");
    });
});
