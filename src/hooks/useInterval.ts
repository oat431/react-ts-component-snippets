import { useEffect, useRef } from "react";

/**
 * useInterval — setInterval that always sees fresh values.
 *
 * Naive `setInterval(() => setCount(c => c+1), 1000)` inside a `[]` effect
 * closes over stale state (or stale props/callbacks). This variant re-wires
 * the timer ONLY when the delay changes, while the callback ref stays current.
 * Clearing on unmount comes free from the effect cleanup.
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    useEffect(() => {
        if (delay === null) return;
        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}
