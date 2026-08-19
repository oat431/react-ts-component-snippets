import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
    beforeEach(() => localStorage.clear());

    it("returns the initial value when storage is empty", () => {
        const { result } = renderHook(() => useLocalStorage("key:a", "fallback"));
        expect(result.current[0]).toBe("fallback");
    });

    it("persists writes to localStorage", () => {
        const { result } = renderHook(() => useLocalStorage("key:b", ""));
        act(() => result.current[1]("hello"));
        expect(result.current[0]).toBe("hello");
        expect(localStorage.getItem("key:b")).toBe(JSON.stringify("hello"));
    });

    it("reads back persisted values on a fresh mount", () => {
        localStorage.setItem("key:c", JSON.stringify({ n: 42 }));
        const { result } = renderHook(() => useLocalStorage<{ n: number }>("key:c", { n: 0 }));
        expect(result.current[0]).toEqual({ n: 42 });
    });

    it("supports functional updates", () => {
        const { result } = renderHook(() => useLocalStorage<number>("key:d", 1));
        act(() => result.current[1]((prev) => prev + 1));
        expect(result.current[0]).toBe(2);
    });
});
