# Phase 2 — Eight Custom Hooks + Playground

> Sprint: 2026-08-19 · Status: ✅ done in ~35 min
> Theme: the README's oldest broken promise, finally real — with tests and live demos.

## The hooks (`src/hooks/`)

| Hook | API | The lesson it encodes |
|---|---|---|
| `useDebounce` | `(value: T, delay=300) => T` | Timer + cleanup = the settled-value pattern. Cleanup cancels the pending update — also THE stale-timer fix. |
| `usePrevious` | `(value: T) => T \| undefined` | Ref written in an effect → next render reads the OLD value. A *controlled* stale value — the teaching example for closures. |
| `useLocalStorage` | `(key, initial) => [T, setter]` | Lazy initializer reads once; setter writes through; try/catch around parse + quota; SSR guard (`typeof window`). |
| `useMediaQuery` | `(query) => boolean` | **Rewritten on `useSyncExternalStore`** — subscribe/cleanup/snapshot without manual effect-setState. |
| `useApi` | `(fetcher, deps) => {data, error, loading}` | The three classic fetch bugs solved: abort on unmount (AbortController), race guard (ignore flag), explicit 3 states. |
| `useOnClickOutside` | `(ref, handler)` | Document-level native listeners (synthetic events stop at the React tree) + cleanup. |
| `useDocumentTitle` | `(title)` | Set on mount, restore previous on unmount — pages don't leak titles across routes. |
| `useInterval` | `(callback, delay \| null)` | `setInterval` without stale closures: callback kept in a ref, re-wired only when delay changes; `null` pauses. |

## useMediaQuery: the rewrite story (interview gold)
First version was the textbook effect version:
```ts
useEffect(() => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
}, [query]);
```
react-hooks v7's `set-state-in-effect` rule flagged the sync `setMatches(mql.matches)` call. Instead of suppressing, rewrote on `useSyncExternalStore`:
```ts
return useSyncExternalStore(
    subscribe,                                    // (onChange) => unsubscribe
    () => window.matchMedia(query).matches,       // client snapshot
    () => false,                                  // server snapshot
);
```
React now owns subscription + tearing prevention. **Line:** "The linter caught my effect-based version doing sync setState — the modern answer is useSyncExternalStore, so I rewrote it instead of suppressing the rule."

## useApi: the race-condition guard (worth rehearsing)
```ts
useEffect(() => {
    const controller = new AbortController();
    let ignore = false;                    // ← the guard
    fetcherRef.current(controller.signal).then((data) => {
        if (!ignore) setState(...);        // only the LAST effect's response commits
    })...
    return () => { ignore = true; controller.abort(); };
}, deps);
```
A slow OLD response cannot overwrite a newer one. `fetcherRef` keeps the fetcher out of deps — inline arrow functions don't re-trigger the effect.

## Playground (`/hooks`)
- **Debounce demo**: search box → visible `input` vs `debounced` values + **API-calls counter** (type fast, counter stays low — the optimization is *visible*)
- **usePrevious**: current vs previous counter
- **useLocalStorage**: name + visit counter that survive refresh
- **useMediaQuery**: live badges for `>=1024px` and `prefers-color-scheme`
- **useApi**: hits the MSW mock health endpoint with abort wiring
- **useOnClickOutside**: dropdown that closes on outside click
- **useDocumentTitle**: type, watch the tab
- **useInterval**: pause/resume/reset timer

## Pitfalls hit
1. `noUnusedLocals` flagged an unused `useState` import in useInterval — strict tsconfig pays for itself.
2. The playground grid uses `useMediaQuery("(min-width: 768px)")` — the hook demoing itself.

## Interview lines
- "Every hook solves one classic bug — debounce: wasted API calls; useApi: races + unmount setState; useInterval: stale closures."
- "If you know how useApi works, you know 70% of what React Query does for you — that's why I reach for the library in real apps."
