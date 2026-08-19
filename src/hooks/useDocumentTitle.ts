import { useEffect } from "react";

/**
 * useDocumentTitle — set document.title for the current page.
 *
 * Restores the previous title on unmount (route change), so pages don't
 * leak their titles into other routes.
 */
export function useDocumentTitle(title: string) {
    useEffect(() => {
        const previous = document.title;
        document.title = title;
        return () => {
            document.title = previous;
        };
    }, [title]);
}
