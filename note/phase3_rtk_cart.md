# Phase 3 — RTK Cart Demo (Context vs Redux, live)

> Sprint: 2026-08-19 · Status: ✅ done in ~20 min
> Theme: make the state-management interview answer PHYSICAL — both tools in one app, contrast visible.

## The story this demo encodes
> "Auth uses Context because it changes ~once per session — low-frequency, app-wide. The cart uses Redux Toolkit because it changes on every click — high-churn shared state. With Context every consumer re-renders on each change; with `useSelector` only components selecting the changed slice re-render."

Both halves of that sentence are running in the same app. That's Script B with a URL.

## Files
| File | Role |
|---|---|
| `src/store/cartSlice.ts` | `createSlice` — `addItem`, `removeItem`, `incrementQty`, `decrementQty`, `clearCart`; selectors `selectCartItems/Total/Count` |
| `src/store/index.ts` | `configureStore({reducer: {cart}})` + exported `RootState`/`AppDispatch` types |
| `src/pages/CartPage.tsx` | Product list → add → qty controls → total; `RenderCount` badge shows page renders |
| `src/components/NavBar.tsx` | `CartBadge` — subscribes ONLY to `selectCartCount` |
| `src/main.tsx` | `<Provider store={store}>` wrapping the app |

## Key mechanics
1. **Immer under the hood** — reducers write `existing.quantity += 1` and it's still immutable. "Looks mutable, produces new state" is the RTK party trick worth saying out loud.
2. **Surgical subscriptions** — the badge's `useSelector(selectCartCount)` re-renders the badge when the count changes; the page's other components don't re-render because their selected values didn't change (reference equality).
3. **Selectors live with the slice** — colocated, testable, reusable. `selectCartTotal` derives; no derived state stored.

## Pitfall hit (embarrassing, then instructive)
First draft put `useSelector(selectCartCount)` **inline in the NavBar's aria-label**:
```tsx
// ❌ the whole NavBar subscribes — defeats the isolation demo
<Link aria-label={`Cart, ${useSelector(selectCartCount)} items`}>
```
Also a hooks violation waiting to happen (conditional-ish usage in JSX expressions). Fix: ALL store reads go through the isolated `CartBadge` component. **Line:** "I initially subscribed the parent by accident — caught it because the demo's whole point is isolation. That's why I keep store-reading components small and singular."

## Verification
Reducer unit tests (Phase 4) cover add/increment/decrement-to-zero/remove/clear + selectors. Clicking `+ Add` on `/cart`: badge count updates, page render counter ticks only for genuinely page-level re-renders.
