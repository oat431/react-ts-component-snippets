import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("returns the initial value immediately", () => {
        const { result } = renderHook(() => useDebounce("init", 300));
        expect(result.current).toBe("init");
    });

    it("does NOT update before the delay elapses", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "a" },
        });

        rerender({ value: "ab" });
        act(() => vi.advanceTimersByTime(299));
        expect(result.current).toBe("a"); // still old value
    });

    it("updates after the delay elapses", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "a" },
        });

        rerender({ value: "ab" });
        act(() => vi.advanceTimersByTime(300));
        expect(result.current).toBe("ab");
    });

    it("resets the timer on rapid changes — one settled value per burst", () => {
        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
            initialProps: { value: "" },
        });

        // rapid keystrokes
        rerender({ value: "u" });
        act(() => vi.advanceTimersByTime(200));
        rerender({ value: "us" });
        act(() => vi.advanceTimersByTime(200)); // 400ms since first, 200 since second
        rerender({ value: "use" });
        act(() => vi.advanceTimersByTime(200));
        expect(result.current).toBe(""); // still nothing settled — timer keeps resetting

        act(() => vi.advanceTimersByTime(301)); // typing stopped
        expect(result.current).toBe("use");
    });
});
