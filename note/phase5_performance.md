# Phase 5 — Performance Playground + ErrorBoundary

> Sprint: 2026-08-19 · Status: ✅ done in ~20 min
> Theme: the JD line "optimize application performance" — made visible and clickable.

## The four panels (`/performance`)

### 1. React.memo + useMemo — with render counters
Two identical lists (each row runs `fib(21)` via `useMemo`): one plain, one wrapped in `memo`. "Re-render parent" bumps parent state → plain list re-renders all rows; memoized list's render counter **stays flat** because props didn't change. `RenderCount` component (ref increment during render — safe because no setState) makes re-renders countable.
**Line:** "memo only helps when props are referentially stable — that's why it pairs with useCallback/useMemo, and why you profile before memoizing."

### 2. Virtualization — 5,000 rows via @tanstack/react-virtual
`useVirtualizer` renders only visible rows + overscan in a positioned container; the page displays the **live DOM-node count** (~15-20, not 5000).
**Line:** "The DOM is the bottleneck at scale — virtualization keeps node count constant regardless of list length." (Checklist's pick over react-window — TanStack is the modern standard.)

### 3. React.lazy + Suspense
`lazy(() => new Promise(...600ms...))` simulates a chunk fetch; fallback spinner while loading. **Line:** "Route-level and heavy-widget splitting keeps the initial bundle small — in this repo the perf page itself is split."

### 4. ErrorBoundary — class component, still the only way
`getDerivedStateFromError` (render fallback) + `componentDidCatch` (log/report) + `resetKeys` prop (parent can retry). "Detonate" button throws in a child subtree → fallback UI, not white screen.
**Line:** "Boundaries catch render errors only — not event handlers, not async code. Those need try/catch; boundaries are your last line for the render path."

## Pitfalls hit
1. **Duplicate `import React` / misplaced imports** — wrote the file in two passes and left a mid-file import; `tsc` + build caught it. Then `React.memo`/`React.ComponentType` needed switching to named imports (`memo`, `type ComponentType`) once the default import was gone.
2. **react-hooks v7 purity rules** flagged the demo busy-wait in `HeavyPanel` (`performance.now()` loop during render). It's INTENTIONALLY impure — it simulates expensive render so the Suspense fallback is visible. Kept with a documented inline disable: "demo busy-wait — never do this in real code."
3. `@tanstack/react-virtual` triggers a "Compilation Skipped: incompatible library" warning (it returns functions) — informational; the list works, and it's honest about React Compiler not memoizing that component.

## Verification
Build green; tests green; the page is interactive — counters diverge on click, 5K rows scroll smoothly, lazy panel loads with spinner, detonate → fallback.
