import { lazy, Suspense, memo, useMemo, useRef, useState, type ComponentType } from "react";
import MainLayout from "../layouts/Section.tsx";
import RenderCount from "../components/RenderCount.tsx";
import ErrorBoundary from "../components/ErrorBoundary.tsx";
import { useVirtualizer } from "@tanstack/react-virtual";

// ---------- Panel 1: memo vs unmemo ----------

/** Expensive-to-render row: 400 fibonacci-style iterations per render. */
function fib(n: number): number {
    return n < 2 ? n : fib(n - 1) + fib(n - 2);
}

function ExpensiveRow({ value }: { value: number }) {
    const heavy = useMemo(() => fib(21), []); // constant heavy work per row
    return (
        <li className="bg-base-200 rounded px-3 py-1.5 font-mono text-sm flex justify-between">
            <span>row {value}</span>
            <span className="text-base-content/50">fib={heavy}</span>
        </li>
    );
}

const MemoRow = memo(ExpensiveRow);

function MemoDemo() {
    const [tick, setTick] = useState(0); // parent state → re-renders children
    const [hiddenValue, setHiddenValue] = useState(42);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">React.memo + useMemo</h3>
                <p className="text-xs text-base-content/60">
                    Both lists get identical props. Clicking "re-render parent" re-renders
                    the plain list; the memoized one skips (props unchanged).
                </p>
                <div className="flex gap-2 items-center">
                    <button className="btn btn-sm btn-primary" onClick={() => setTick((t) => t + 1)}>
                        re-render parent ({tick})
                    </button>
                    <button className="btn btn-sm" onClick={() => setHiddenValue((v) => v + 1)}>
                        change unrelated state
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                        <RenderCount label="plain list renders" />
                        <ul className="flex flex-col gap-1 mt-1">
                            {[0, 1, 2].map((i) => <ExpensiveRow key={i} value={hiddenValue} />)}
                        </ul>
                    </div>
                    <div>
                        <RenderCount label="memoized list renders" />
                        <ul className="flex flex-col gap-1 mt-1">
                            {[0, 1, 2].map((i) => <MemoRow key={i} value={hiddenValue} />)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ---------- Panel 2: virtualization ----------

function VirtualListDemo() {
    const ROWS = 5000;
    const parentRef = useRef<HTMLDivElement>(null);
    const virtualizer = useVirtualizer({
        count: ROWS,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 36,
        overscan: 5,
    });

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">Virtualization — {ROWS.toLocaleString()} rows</h3>
                <p className="text-xs text-base-content/60">
                    Only visible rows (+ overscan) exist in the DOM. Scroll it — it stays smooth.
                </p>
                <div
                    ref={parentRef}
                    className="h-64 overflow-auto border border-base-300 rounded-lg bg-base-200"
                >
                    <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                        {virtualizer.getVirtualItems().map((vRow) => (
                            <div
                                key={vRow.index}
                                className="absolute left-0 w-full border-b border-base-300/50 px-3 font-mono text-sm flex items-center"
                                style={{ height: vRow.size, transform: `translateY(${vRow.start}px)` }}
                            >
                                row {vRow.index.toLocaleString()}
                            </div>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-base-content/60">
                    DOM nodes for the list: ~{virtualizer.getVirtualItems().length}, not {ROWS.toLocaleString()}.
                </p>
            </div>
        </div>
    );
}

// ---------- Panel 3: lazy + Suspense ----------

// Fake-heavy component: its chunk is split AND its render is artificially slow.
function HeavyPanel() {
    // Intentionally impure + slow — it SIMULATES an expensive render so the
    // lazy-load fallback is visible. Never do this in real code.
    // eslint-disable-next-line react-hooks/purity
    const start = performance.now();
    // eslint-disable-next-line react-hooks/purity -- demo busy-wait, see above
    while (performance.now() - start < 300) { /* simulate expensive init */ }
    return (
        <div className="alert alert-success">
            <span>Heavy panel loaded lazily — its code was NOT in the initial bundle.</span>
        </div>
    );
}
const LazyHeavy = lazy(() =>
    new Promise<{ default: ComponentType }>((resolve) =>
        setTimeout(() => resolve({ default: HeavyPanel }), 600),
    ),
);

function LazyDemo() {
    const [show, setShow] = useState(false);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">React.lazy + Suspense</h3>
                <p className="text-xs text-base-content/60">
                    Code-split a heavy component; fallback shows while the chunk loads.
                </p>
                <button className="btn btn-sm btn-primary w-fit" onClick={() => setShow(true)}>
                    load heavy panel
                </button>
                {show && (
                    <Suspense fallback={<span className="loading loading-spinner"></span>}>
                        <LazyHeavy />
                    </Suspense>
                )}
            </div>
        </div>
    );
}

// ---------- Panel 4: ErrorBoundary ----------

function Bomb() {
    const [boom] = useState(() => {
        throw new Error("intentional demo error");
    });
    return <div>{boom}</div>;
}

function ErrorBoundaryDemo() {
    const [armed, setArmed] = useState(false);
    const [resetKey, setResetKey] = useState(0);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">ErrorBoundary</h3>
                <p className="text-xs text-base-content/60">
                    Render crash inside a boundary → fallback UI, not a white screen.
                </p>
                <button className="btn btn-sm btn-error w-fit" onClick={() => { setArmed(true); setResetKey((k) => k + 1); }}>
                    detonate
                </button>
                <div className="mt-2">
                    <ErrorBoundary resetKeys={[resetKey]} key={resetKey}>
                        {armed ? <Bomb /> : <div className="text-sm text-base-content/60">safe zone</div>}
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
}

export default function PerformancePage() {
    return (
        <MainLayout>
            <div className="w-full max-w-3xl text-left flex flex-col gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Performance Playground</h1>
                    <p className="text-sm text-base-content/70">
                        The optimization triad — memoization, virtualization, code splitting — plus
                        ErrorBoundary. Watch the render counters.
                    </p>
                </div>
                <MemoDemo />
                <VirtualListDemo />
                <LazyDemo />
                <ErrorBoundaryDemo />
            </div>
        </MainLayout>
    );
}
