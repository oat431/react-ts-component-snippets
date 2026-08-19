import { useEffect } from "react";

/**
 * useOnClickOutside — call `handler` when a pointerdown lands outside `ref`.
 *
 * React's synthetic events stop at the React tree — for "click outside"
 * (dropdowns, modals, menus) we need the document-level native listener,
 * attached in an effect and cleaned up on unmount.
 */
export function useOnClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T | null>,
    handler: () => void,
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (!el || el.contains(event.target as Node)) return;
            handler();
        };

        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}
