# Phase 0 — Quick Fixes (a11y + dead link)

> Sprint: 2026-08-19 · Status: ✅ done in ~10 min
> Theme: kill credibility-damaging bugs before adding anything.

## What was fixed

| # | Fix | Where | Why it matters |
|---|---|---|---|
| 0.1 | Removed `/about` NavBar link | `src/components/NavBar.tsx` | Route didn't exist → 404. A senior reviewer clicks links. |
| 0.2 | Login labels associated (`htmlFor` + `id`) | `LoginPage.tsx` | Unlabeled inputs = WCAG failure + RTL `getByLabelText` impossible. |
| 0.3 | Register labels associated | `RegisterPage.tsx` | Same. |

Also added `autoComplete="username" / "email" / "current-password"` — small, but it's the difference between a form that fights password managers and one that doesn't.

## The pattern to remember

```jsx
// ❌ label floats near input — screen readers can't tie them together
<label className="label">Username</label>
<input type="text" ... />

// ✅ explicit association
<label className="label" htmlFor="login-username">Username</label>
<input id="login-username" type="text" autoComplete="username" ... />
```

Why `htmlFor`/`id` and not wrapping? Both work, but explicit association survives layout refactors (moving the label into another element breaks wrapping silently).

## Interview line
> "First thing I did in the repo was an audit pass — a dead nav link and unlabeled form fields are exactly what a reviewer catches in the first two minutes."

## Verification
`npm run build` green; every NavBar target resolves to a real route.
