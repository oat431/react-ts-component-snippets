# Phase 4 — Vitest + React Testing Library (26 tests)

> Sprint: 2026-08-19 · Status: ✅ done in ~35 min
> Theme: behavior-first testing — the repo's identity is "every snippet ships with its test."

## Setup
| File | Role |
|---|---|
| `vitest.config.ts` | jsdom environment, globals, setup file, `css: false` (skip tailwind processing in tests) |
| `src/test/setup.ts` | jest-dom matchers + **MSW server lifecycle** (`listen`/`resetHandlers`/`close`) + `matchMedia` polyfill |
| `src/test/utils.tsx` | `renderWithProviders` — full provider stack (Redux + Auth + MemoryRouter) |
| `package.json` | `"test": "vitest run"` |

## The suite (5 files, 26 tests)

| File | What it proves |
|---|---|
| `useDebounce.test.ts` | Fake timers: no update before delay; update after; rapid keystrokes reset the timer (one settled value per burst) |
| `useLocalStorage.test.ts` | Initial value, write-through, read-back on fresh mount, functional updates |
| `cartSlice.test.ts` | Pure reducers: add/increment/merge, decrement-to-zero removes, remove/clear, selectors compute count/total |
| `LoginPage.test.tsx` | Accessible form renders; empty submit blocked + field errors; short password caught; `aria-invalid` flags; wrong creds → alert **(through the real axios client + MSW)**; demo creds → tokens stored; password toggle |
| `AuthContext.test.tsx` | Starts unauthenticated; login persists state+storage; restores from storage on mount; logout clears; **401 event → auto-logout** (interceptor contract); `useAuth` outside provider throws |

## Philosophy encoded (checklist §9)
- **Queries by role/label** — `getByRole('button', {name: /login/i})`, `getByLabelText(/username/i)`. Never testid, never implementation details.
- **`userEvent`, not `fireEvent`** — real focus/keyboard semantics.
- **MSW at the network boundary** — the axios client, interceptors, and services run for real; only the server is fake. Same handlers as the live demo.
- **The 401 test is the contract test** — it pins the window-event wiring between `APIClient.ts` and `AuthContext.tsx`. If anyone breaks the interceptor or the listener, this test fails. THAT's what integration tests are for.

## The two failures that taught something

### 1. "could not find react-redux context value"
LoginPage renders `MainLayout` → `NavBar` → `CartBadge` → `useSelector`. My first render wrapped Router+Auth only → crash. **Lesson:** page tests need the FULL provider stack, exactly like the real tree — hence `renderWithProviders` as a utility. This is the standard RTL pattern (and a good thing to mention: "our test utils mirror the app tree so tests can't drift from reality").

### 2. "Found multiple elements with text /password/i"
The password-toggle's `aria-label="Show password"` collided with the input's label in accessible-name queries. Fix: label the toggle "Show secret". **Lesson:** accessible names are shared by tests AND screen readers — treat them like an API.

## Commands
```bash
npm test            # 26/26 green, ~5s
npx vitest run src/pages/LoginPage.test.tsx   # single file
```
