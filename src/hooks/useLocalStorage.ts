import { useCallback, useState } from "react";

/**
 * useLocalStorage — useState that persists to localStorage.
 *
 * Lazy initializer reads once; setter writes through.
 * Note: writing to localStorage does NOT trigger re-renders — the state does.
 * SSR guard: typeof window check (no localStorage during SSR/hydration).
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
    const [stored, setStored] = useState<T>(() => {
        if (typeof window === "undefined") return initialValue;
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch {
            return initialValue;
        }
    });

    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            setStored((prev) => {
                const next = value instanceof Function ? value(prev) : value;
                try {
                    window.localStorage.setItem(key, JSON.stringify(next));
                } catch {
                    // Quota exceeded / private mode — state still updates
                }
                return next;
            });
        },
        [key],
    );

    return [stored, setValue] as const;
}
