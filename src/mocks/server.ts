import { setupServer } from "msw/node";
import { handlers } from "./handlers";

/**
 * MSW server for Vitest — same handlers as the browser demo.
 * One mock layer, two uses: live demo + test suite.
 */
export const server = setupServer(...handlers);
