import { useEffect, useRef } from "react";

/**
 * usePrevious — the value from the PREVIOUS render, or undefined on first render.
 *
 * Why this exists: effects close over the render scope that created them.
 * The ref assignment happens in an effect (after render), so `ref.current`
 * during the NEXT render still holds the old value — a controlled stale value.
 * This hook is also THE teaching example for how stale closures work.
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]); // runs AFTER render → next render sees the old value

    return ref.current;
}
