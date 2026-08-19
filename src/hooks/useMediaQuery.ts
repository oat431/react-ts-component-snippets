import { useCallback, useSyncExternalStore } from "react";

/**
 * useMediaQuery — true when the CSS media query matches.
 *
 * Built on useSyncExternalStore (React 18+): the "right" way to subscribe to
 * an external store. React handles: subscription, cleanup, and tearing
 * prevention — no manual effect + setState dance.
 */
function subscribeToMediaQuery(query: string, onChange: () => void) {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
}

export function useMediaQuery(query: string): boolean {
    const subscribe = useCallback(
        (onChange: () => void) => subscribeToMediaQuery(query, onChange),
        [query],
    );

    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches, // client snapshot
        () => false, // server snapshot (SSR)
    );
}
