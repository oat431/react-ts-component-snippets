import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * MSW browser worker for demo mode.
 * Started in main.tsx when RTCS_DEMO !== "false".
 */
export const worker = setupWorker(...handlers);
