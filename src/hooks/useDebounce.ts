import { useEffect, useState } from "react";

/**
 * useDebounce — returns `value` after it has been stable for `delay` ms.
 *
 * Why: search inputs. Don't call an API on every keystroke —
 * onChange → local state → debounce → API call (one call per typing pause).
 */
export function useDebounce<T>(value: T, delay = 300): T {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        // Cleanup cancels the pending update — this is also the stale-timer fix.
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
