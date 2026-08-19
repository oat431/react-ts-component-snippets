import { useRef } from "react";

/**
 * RenderCount — counts how many times IT rendered. Demo tool for showing
 * re-render behavior (React.memo, useSelector isolation) with visible numbers.
 *
 * Incrementing a ref during render is safe here: it writes no state (which
 * would loop) — it's a render-time side effect purely for display.
 */
export default function RenderCount({ label }: { label: string }) {
    const count = useRef(0);
    count.current += 1;
    return <span className="badge badge-ghost badge-sm font-mono">{label}: {count.current}</span>;
}
