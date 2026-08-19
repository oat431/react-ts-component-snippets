import { useEffect, useRef, useState } from "react";

interface ApiState<T> {
    data: T | null;
    error: Error | null;
    loading: boolean;
}

/**
 * useApi — data fetching hook that handles the three classic fetch bugs:
 *   1. setState after unmount        → AbortController, aborted in cleanup
 *   2. race conditions on re-fetch   → ignore flag: only the LAST effect's
 *      response is committed (an older slow response can't overwrite a newer one)
 *   3. missing loading/error states  → explicit loading / error / data states
 *
 * Prefer React Query / SWR for real apps — this hook exists to show the
 * mechanics those libraries solve for you.
 */
export function useApi<T>(fetcher: (signal: AbortSignal) => Promise<T>, deps: unknown[] = []) {
    const [state, setState] = useState<ApiState<T>>({ data: null, error: null, loading: true });
    // Keep the fetcher in a ref so it isn't a dependency (avoids re-fetch loops
    // when callers pass an inline arrow function).
    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    useEffect(() => {
        const controller = new AbortController();
        let ignore = false;

        setState((s) => ({ ...s, loading: true, error: null }));

        fetcherRef
            .current(controller.signal)
            .then((data) => {
                if (!ignore) setState({ data, error: null, loading: false });
            })
            .catch((error: unknown) => {
                if (ignore || (error instanceof DOMException && error.name === "AbortError")) return;
                setState({ data: null, error: error as Error, loading: false });
            });

        return () => {
            ignore = true;
            controller.abort();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);

    return state;
}
