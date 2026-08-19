import "@testing-library/jest-dom/vitest";

// MSW test server — same handlers as the browser demo (one mock layer, two uses)
import { server } from "../mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// jsdom lacks matchMedia — polyfill for hooks/pages that use it
if (!window.matchMedia) {
    window.matchMedia = ((query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {}, // legacy
        removeListener: () => {}, // legacy
        dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
}
