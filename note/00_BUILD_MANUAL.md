# RTCS Build Manual — Interview Sprint (2026-08-19)

> **Purpose:** phase-by-phase record of today's sprint. Each phase: goal → files → verification → what it proves in the interview.
> **Structure standard:** `F:\obsidian_note\swe-knowledge\checklist\web-checklist\react-js.md` (tier: 2→3 climbing — snippets repo becoming a demo portfolio).
> **Hard stop: 14:00** — then rehearsal. Phases 1, 4, 6 never drop; 5 shrinks first, then 2 trims to top-4 hooks.

## Checklist mapping (what we're satisfying)

| Checklist section | Where it lands |
|---|---|
| §9 Testing — Vitest, RTL (`getByRole`/`userEvent`, not fireEvent/testid), MSW | Phase 1 + 4 |
| §10 a11y — label association, semantic HTML, aria-invalid/live/busy | Phase 0 + 1 |
| §5 Performance — virtualization (@tanstack/react-virtual), debounce, lazy loading | Phase 2 + 5 |
| §4 Client State — Context only for global low-frequency; store for high-churn | Phase 3 (Context=auth vs RTK=cart contrast) |
| §7 Forms — states: idle/submitting/success/error, inline field errors | Phase 1 |
| §11 Security — token storage trade-off documented (known, deliberate demo choice) | manual note below |
| §12 Build & Deploy — CI lint → type-check → test → build | Phase 6 |
| §13 Error Handling — ErrorBoundary component | Phase 5 |

> **Known deviation (deliberate):** tokens in localStorage, not httpOnly cookies — this is a frontend-only demo with a mocked backend; the trade-off is documented in code comments and is itself an interview talking point (checklist §11).

---

## Phase 0 — Quick fixes ✅ (15 min)

**Goal:** kill credibility-damaging bugs before adding anything.

| # | Fix | File |
|---|---|---|
| 0.1 | Remove dead `/about` NavBar link (route doesn't exist → 404) | `src/components/NavBar.tsx` |
| 0.2 | Associate labels with inputs (`htmlFor` + `id`) — Login | `src/pages/LoginPage.tsx` |
| 0.3 | Same for Register | `src/pages/RegisterPage.tsx` |

**Verification:** `npm run build` passes; clicking every NavBar link navigates to a real route.

**Interview line:** "First thing I did was audit the repo — dead links and unlabeled forms are exactly what a reviewer catches."

- [x] 0.1 done
- [x] 0.2 done
- [x] 0.3 done

## Phase 1 — MSW demo mode + Login upgrade (30–40 min) 🔑

**Goal:** app runs and demos WITHOUT the abandoned backend; login form becomes a complete form snippet.

**Files:**
- `src/mocks/handlers.ts` — REST handlers: login, register, revoke, detail, verify-email, health
- `src/mocks/browser.ts` — `setupWorker`
- `src/mocks/server.ts` — `setupServer` (reused by Vitest, Phase 4)
- `src/main.tsx` — boot worker when `RTCS_DEMO !== 'false'`
- `.env.example` — document `RTCS_DEMO`
- `src/pages/LoginPage.tsx` — inline validation (field errors, disabled submit), `aria-invalid`, `aria-live` error region, show/hide password

**MSW handler contract (matches `types/Auth.ts`):** login accepts `demo` / `password` → returns `access_token`/`refresh_token`; wrong creds → status `ERROR` with message (not HTTP 500 — mirrors real API envelope).

**Verification:** `RTCS_DEMO=true npm run dev` → login with demo/password → dashboard loads, logout works, 401 flow still fires auto-logout.

**Interview lines:**
- "The backend was decommissioned, so I mock at the network boundary with MSW — the same handlers run the live demo AND the Vitest suite. One mock layer, two uses."
- Form: idle → submitting → success/error, inline field-level validation, aria states.

- [ ] handlers + worker + server
- [ ] main.tsx boot
- [ ] LoginPage validation + a11y + password toggle
- [ ] verified in browser

## Phase 2 — Custom hooks + playground (45–60 min)

**Goal:** the README's oldest promise, finally real. Each hook: implementation + test + live demo.

**Files:** `src/hooks/*.ts` (7 hooks), `src/pages/HooksPage.tsx`, route + NavBar link.

| Hook | API | Proves |
|---|---|---|
| `useDebounce` | `(value: T, delay=300) => T` | timers, closures — JD perf line |
| `usePrevious` | `(value: T) => T \| undefined` | refs + stale-closure mechanics |
| `useLocalStorage` | `(key, initial) => [T, setter]` | external store, SSR guard |
| `useMediaQuery` | `(query: string) => boolean` | matchMedia + effect cleanup |
| `useApi` | `(fn, deps) => {data, error, loading}` | AbortController, race-safe fetch |
| `useOnClickOutside` | `(ref, cb)` | refs + native events |
| `useDocumentTitle` | `(title: string)` | 10-line win, SPA titles (sanity check §) |

**Playground:** debounced search (fake API + render count), media-query live indicator, outside-click dropdown.

**Verification:** `/hooks` page — type in search box, watch debounced value + "API calls: N" counter stay low; resize window, watch `useMediaQuery` flip.

- [ ] 7 hooks implemented
- [ ] playground page + route
- [ ] verified in browser

## Phase 3 — RTK cart demo (30 min) 🔑

**Goal:** make Script B physical — auth=Context (low-frequency) vs cart=RTK (high-churn) in ONE app.

**Files:** `src/store/cartSlice.ts`, `src/store/index.ts`, `src/pages/CartPage.tsx`, `main.tsx` Provider, route + NavBar link.

**Slice:** `addItem`, `removeItem`, `updateQty`, `clear` — Immer-style mutation syntax. Optional: `createAsyncThunk` fake checkout.

**Demo page:** product list (static array) → add → badge count in NavBar → qty controls → total. Render-counter on the badge vs page proves `useSelector` surgical re-renders.

**Verification:** add items → ONLY badge re-renders (counter increments), page render count unchanged.

**Interview line:** "State tool per update frequency — the auth context changes once per session; the cart changes on every click. That's why they use different tools in this app."

- [ ] cartSlice + store
- [ ] cart page + navbar badge
- [ ] verified: surgical re-render observable

## Phase 4 — Vitest + RTL (45–60 min) 🔑

**Goal:** every snippet ships with its test. Checklist §9: behavior queries, userEvent, MSW.

**Setup:** `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`; `vitest.config.ts`, `src/test/setup.ts`; `npm test`.

**Tests:**
| File | Asserts |
|---|---|
| `useDebounce.test.ts` | fake timers; value settles after delay, not before |
| `useLocalStorage.test.ts` | persist + initial from storage |
| `cartSlice.test.ts` | pure reducers: add/remove/qty/clear |
| `LoginPage.test.tsx` | invalid → blocked + field errors; bad creds → error alert; success → tokens stored + navigate (MSW) |
| `AuthContext.test.tsx` | login/logout state + persistence; **401 event → auto-logout** (interceptor contract) |

**Verification:** `npm test` green; `npm run build` still green.

- [ ] setup + config
- [ ] 5 test files green
- [ ] `npm test` wired

## Phase 5 — Performance demos + ErrorBoundary (30 min)

**Files:** `src/pages/PerformancePage.tsx`, `src/components/ErrorBoundary.tsx`, route + NavBar link.

**Panels:** (1) memo vs unmemo — render counters side by side; (2) `@tanstack/react-virtual` — 5,000 rows; (3) `React.lazy` + Suspense heavy panel.

**Verification:** render counters visibly diverge on re-render trigger; 5K rows scroll at 60fps; lazy chunk visible in Network tab.

- [ ] 3 panels + ErrorBoundary
- [ ] verified in browser

## Phase 6 — CI + ship (15 min)

**Files:** `.github/workflows/ci.yml`, README rewrite to reality.

**CI:** Node 24, `npm ci` → `npm run lint` → `npm test` → `npm run build`. On push + PR.

**Verification:** green check on GitHub. **PUSH by 14:00.**

- [ ] workflow file
- [ ] README rewrite
- [ ] pushed + green

---

## Timebox ledger
| Phase | Budget | Actual |
|---|---|---|
| 0 | 0:15 | 0:10 |
| 1 | 0:40 | — |
| 2 | 1:00 | — |
| 3 | 0:30 | — |
| 4 | 1:00 | — |
| 5 | 0:30 | — |
| 6 | 0:15 | — |
