import { http, HttpResponse } from "msw";

/**
 * Mock API for demo mode & tests.
 *
 * The original backend is decommissioned — these handlers mock at the network
 * boundary, so the REAL service layer (axios client, interceptors) runs in both
 * the live demo and the Vitest suite. One mock layer, two uses.
 *
 * Contract mirrors types/Auth.ts (ApiResponse envelope).
 *
 * Demo credentials: username "demo", password "password".
 */

const DEMO_USER = "demo";
const DEMO_PASS = "password";

function ok<T>(data: T) {
    return HttpResponse.json({
        data,
        status: "SUCCESS",
        error: null,
    });
}

function fail(httpCode: number, errorCode: string, message: string) {
    return HttpResponse.json(
        {
            data: null,
            status: "FAIL",
            error: { http_code: httpCode, error_code: errorCode, message },
        },
        { status: httpCode },
    );
}

// Fake JWTs — structure only, never a real secret.
const ACCESS_TOKEN =
    "demo.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJzdWIiOiJkZW1vIiwidXNlcm5hbWUiOiJkZW1vIn0.sig";
const REFRESH_TOKEN = "demo-refresh-token";

export const handlers = [
    // POST /auth/login
    http.post("*/auth/login", async ({ request }) => {
        const body = (await request.json()) as { username?: string; password?: string };
        const { username, password } = body ?? {};

        if (username === DEMO_USER && password === DEMO_PASS) {
            return ok({ access_token: ACCESS_TOKEN, refresh_token: REFRESH_TOKEN });
        }
        return fail(401, "AUTH_INVALID_CREDENTIALS", "Invalid username or password.");
    }),

    // POST /auth/register
    http.post("*/auth/register", async ({ request }) => {
        const body = (await request.json()) as {
            username?: string;
            email?: string;
            password?: string;
        };
        const { username, email } = body ?? {};

        if (!username || !email || !body.password) {
            return fail(400, "VALIDATION_ERROR", "Username, email and password are required.");
        }
        if (username === DEMO_USER) {
            return fail(409, "AUTH_USERNAME_TAKEN", "This username is already taken.");
        }
        return ok({ id: "usr_demo_001", username, email, is_verified: false });
    }),

    // GET /auth/detail — requires Bearer token (checked like the real API would)
    http.get("*/auth/detail", ({ request }) => {
        const auth = request.headers.get("Authorization");
        if (auth !== `Bearer ${ACCESS_TOKEN}`) {
            return fail(401, "AUTH_UNAUTHORIZED", "Missing or invalid token.");
        }
        return ok({
            id: "usr_demo_001",
            username: DEMO_USER,
            email: "demo@example.com",
            is_verified: true,
        });
    }),

    // POST /auth/revoke
    http.post("*/auth/revoke", () => {
        return ok("Refresh token revoked.");
    }),

    // GET /auth/verify-email?token=...
    http.get("*/auth/verify-email", ({ request }) => {
        const token = new URL(request.url).searchParams.get("token");
        if (token === "valid-token") {
            return ok("Email verified successfully!");
        }
        return fail(400, "AUTH_INVALID_TOKEN", "Invalid or expired verification token.");
    }),

    // GET /health-check/health
    http.get("*/health-check/health", () => {
        return HttpResponse.json("Mock API is healthy (MSW demo mode)");
    }),
];
