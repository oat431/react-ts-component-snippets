# Phase 6 — CI, README Rewrite, Ship

> Sprint: 2026-08-19 · Status: ✅ done ~12:05 (hard stop was 14:00)
> Theme: a repo that isn't pushed doesn't exist; a README that lies is worse than none.

## CI (`.github/workflows/ci.yml`)
```yaml
on: push/pull_request → [main, dev]
jobs.verify (ubuntu, Node 24, npm cache):
  npm ci → npm run lint → npm run build (tsc -b + vite) → npm test
```
Same gates I ran locally — the pipeline is just the local gate, automated.

## Pitfall: CI was silent after the first push
Workflow triggered on `main` only — but this repo's **default branch is `dev`** (check `git branch -a` / `origin/HEAD`, never assume). Fixed branches → CI ran green in **43s**.
**Line:** "I shipped a workflow that watched the wrong branch — the fix taught me to always verify the default branch before writing branch triggers."

## README rewrite
Old README promised "Form Validation / State Management / Custom Hook Snippets" that didn't exist — a reviewer's first click would've exposed the gap. New README describes reality: stack table, per-route sections (hooks/cart/performance/auth), testing approach with the MSW story, run instructions, env vars (`RTCS_DEMO`, `RTCS_API_URL`), and the documented localStorage trade-off:
> demo stores JWTs in localStorage; production would use httpOnly cookies (XSS-safe) — deliberate, documented choice.

## The lint campaign (biggest unplanned chunk, worth it)
`npm run lint` initially: **28 errors** — react-hooks v7 (React-Compiler-era rules) + strict typed-lint on pre-existing code. Resolution strategy, in order:
1. **Better code first**: `useMediaQuery` → `useSyncExternalStore`; `APIClient` interceptors typed with `isAxiosError` narrowing + Error-wrapped rejections; `RegisterPage`'s promise-in-setTimeout voided.
2. **Config where scope was wrong**: tests + vitest.config got their own block (node globals, floating-promises off — test ergonomics); `vitest.config.ts` added to tsconfig projects so the parser could see it.
3. **Documented inline disables only where the pattern IS the lesson**: `usePrevious`/`RenderCount` read refs during render (that's the teaching point), session-restore setState in effect (hydration comment explains why lazy-init was rejected), demo busy-wait.

Final: **0 errors, 1 benign warning** (react-virtual compatibility notice).

## Final state
- Local: lint 0 errors · 26/26 tests · build clean
- Remote: `dev` @ `c76e897`, CI green (43s)
- 3 commits: feature sprint → CI branch fix → build-manual docs
