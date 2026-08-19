# React TypeScript Component Snippets (RTCS)

A living library of React 19 + TypeScript snippets — hooks, patterns, performance demos, and state management — each shipped with tests. Runs in **demo mode** (MSW mocks the decommissioned backend) so everything is clickable without any server.

**Demo login:** `demo` / `password`

## Stack

| | |
|---|---|
| React 19 · TypeScript 5.9 (strict) | Vite 7 · Tailwind 4 · daisyUI 5 |
| react-router 7 · axios | Redux Toolkit (cart demo) |
| **Vitest + React Testing Library** (26 tests) | **MSW** (mock API — demo + tests share handlers) |
| @tanstack/react-virtual (5K-row demo) | GitHub Actions CI (lint → build → test) |

## What's inside

### `/hooks` — Hooks Playground (8 custom hooks, live demos)
| Hook | What it demonstrates |
|---|---|
| `useDebounce` | search input → settled value → one API call (with visible call counter) |
| `usePrevious` | refs + the stale-closure mechanic, made visible |
| `useLocalStorage` | useState with write-through persistence |
| `useMediaQuery` | matchMedia subscription + effect cleanup |
| `useApi` | AbortController, race-condition guard, loading/error/data states |
| `useOnClickOutside` | document-level listeners with cleanup (dropdown pattern) |
| `useDocumentTitle` | titles per route, restored on unmount |
| `useInterval` | setInterval without stale closures (callback ref) |

### `/cart` — Redux Toolkit demo
`cartSlice` + `configureStore` + `useSelector` isolation: the navbar badge subscribes only to `selectCartCount`, so cart clicks re-render the badge — not the page. Deliberate contrast with auth: **Context for low-frequency state (session), RTK for high-churn shared state (cart).**

### `/performance` — Optimization demos
- **React.memo + useMemo** vs plain — side-by-side render counters
- **Virtualization** — 5,000 rows via @tanstack/react-virtual (see the live DOM-node count)
- **React.lazy + Suspense** — code-split heavy panel
- **ErrorBoundary** — class component, fallback UI, `resetKeys` retry

### Auth flow (real code, mocked API)
Login (inline validation, aria states, show/hide password) → JWT tokens via axios interceptors → `ProtectedRoute` guard → dashboard → logout with revoke. The axios 401 interceptor and `AuthContext` auto-logout are wired by a window event — and tested.

## Testing approach

Behavior-first (RTL): queries by role/label, `userEvent` interactions, assertions on what a user sees. Network mocked at the boundary with **the same MSW handlers that power demo mode** — one mock layer, two uses. Test utilities in `src/test/utils.tsx` render pages with the full provider stack.

```bash
npm test        # 26 tests across 5 files
```

## Running

```bash
npm install
npm run dev     # http://localhost:3000 — MSW demo mode on by default
npm test
npm run lint
npm run build
```

| Env var | Purpose |
|---|---|
| `RTCS_DEMO` | `true` (default) = MSW mock API · `false` = real API |
| `RTCS_API_URL` | API base URL when demo mode is off |

> **Note on tokens:** demo stores JWTs in localStorage. In production I'd use httpOnly cookies (XSS-safe) — this is a frontend-only demo against a mocked API, and the trade-off is a deliberate, documented choice.

## Notes
`note/` — learning notes and the phase-by-phase build manual (`00_BUILD_MANUAL.md`).
