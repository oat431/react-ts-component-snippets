import { useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "../layouts/Section.tsx";
import { useDebounce } from "../hooks/useDebounce.ts";
import { usePrevious } from "../hooks/usePrevious.ts";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";
import { useMediaQuery } from "../hooks/useMediaQuery.ts";
import { useApi } from "../hooks/useApi.ts";
import { useOnClickOutside } from "../hooks/useOnClickOutside.ts";
import { useDocumentTitle } from "../hooks/useDocumentTitle.ts";
import { useInterval } from "../hooks/useInterval.ts";

// ---------- fake "API" for the debounce demo ----------
const CATALOG = ["useDebounce", "usePrevious", "useLocalStorage", "useMediaQuery", "useApi", "useOnClickOutside", "useDocumentTitle", "useInterval", "useState", "useEffect", "useMemo", "useCallback", "useRef", "useContext"];

function fakeSearchApi(query: string): Promise<string[]> {
    // Simulated latency — makes the debounce saving visible.
    return new Promise((resolve) =>
        setTimeout(() => resolve(CATALOG.filter((item) => item.toLowerCase().includes(query.toLowerCase()))), 400),
    );
}

// ---------- demo components ----------

function DebounceDemo() {
    const [query, setQuery] = useState("");
    const [apiCalls, setApiCalls] = useState(0);
    const debouncedQuery = useDebounce(query, 300);

    // Stand-in for a real API call: fires only when the DEBOUNCED value changes
    const [results, setResults] = useState<string[]>([]);
    useEffect(() => {
        if (debouncedQuery === "") {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- demo: clear results on empty query
            setResults([]);
            return;
        }
         
        setApiCalls((n) => n + 1);
        void fakeSearchApi(debouncedQuery).then(setResults);
    }, [debouncedQuery]);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useDebounce</h3>
                <p className="text-xs text-base-content/60">search input → 300ms pause → one API call (not one per keystroke)</p>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Search hooks…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Search hooks demo"
                />
                <div className="text-xs font-mono bg-base-200 rounded-lg p-2 mt-2">
                    <div>input: <span className="text-primary">{query || "—"}</span></div>
                    <div>debounced: <span className="text-secondary">{debouncedQuery || "—"}</span></div>
                    <div>API calls: <span className="text-error">{apiCalls}</span></div>
                </div>
                {results.length > 0 && (
                    <ul className="text-xs bg-base-200 rounded-lg p-2 font-mono">
                        {results.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                )}
                <p className="text-xs text-base-content/60">Type "used" quickly — many keystrokes, ONE api call.</p>
            </div>
        </div>
    );
}

function PreviousDemo() {
    const [count, setCount] = useState(0);
    const previous = usePrevious(count);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">usePrevious</h3>
                <p className="text-xs text-base-content/60">ref assignment in an effect → next render sees the OLD value</p>
                <div className="flex items-center gap-3">
                    <button className="btn btn-sm btn-primary" onClick={() => setCount((c) => c + 1)}>+1</button>
                    <div className="text-sm font-mono bg-base-200 rounded-lg px-3 py-2">
                        current: {count} · previous: {previous === undefined ? "undefined" : previous}
                    </div>
                </div>
                <p className="text-xs text-base-content/60">First render shows undefined — the ref hasn't been written yet.</p>
            </div>
        </div>
    );
}

function LocalStorageDemo() {
    const [name, setName] = useLocalStorage("rtcs:demo:name", "");
    const [visits, setVisits] = useLocalStorage<number>("rtcs:demo:visits", 0);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useLocalStorage</h3>
                <p className="text-xs text-base-content/60">useState + write-through persistence — refresh the page</p>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    aria-label="Your name"
                />
                <div className="flex items-center gap-2">
                    <button className="btn btn-sm btn-primary" onClick={() => setVisits((v) => v + 1)}>count a visit</button>
                    <span className="text-sm font-mono bg-base-200 rounded-lg px-3 py-2">
                        {name ? `${name} · ` : ""}visits: {visits}
                    </span>
                </div>
            </div>
        </div>
    );
}

function MediaQueryDemo() {
    const isWide = useMediaQuery("(min-width: 1024px)");
    const isDark = useMediaQuery("(prefers-color-scheme: dark)");

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useMediaQuery</h3>
                <p className="text-xs text-base-content/60">live matchMedia subscription — resize the window</p>
                <div className="flex flex-wrap gap-2">
                    <span className={`badge ${isWide ? "badge-success" : "badge-ghost"}`}>&gt;= 1024px: {String(isWide)}</span>
                    <span className={`badge ${isDark ? "badge-success" : "badge-ghost"}`}>dark mode: {String(isDark)}</span>
                </div>
                <p className="text-xs text-base-content/60">Effect subscribes + cleans up the matchMedia listener.</p>
            </div>
        </div>
    );
}

function ApiDemo() {
    // fetcher receives the abort signal — real apps: fetch(url, { signal })
    const { data, loading, error } = useApi<string>(
        (signal) =>
            fetch("http://localhost:8003/api/v1/health-check/health", { signal })
                .then((r) => r.json()),
        [],
    );

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useApi</h3>
                <p className="text-xs text-base-content/60">AbortController + race-condition guard + 3 states</p>
                {loading && <span className="loading loading-spinner"></span>}
                {error && <div className="alert alert-error text-sm">{String(error)}</div>}
                {data && <div className="text-sm font-mono bg-base-200 rounded-lg p-2">{String(data)}</div>}
                <p className="text-xs text-base-content/60">
                    With MSW demo mode on, this hits the mock health endpoint. The AbortController wiring means
                    unmounting this card mid-request never calls setState.
                </p>
            </div>
        </div>
    );
}

function OnClickOutsideDemo() {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, () => setOpen(false));

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useOnClickOutside</h3>
                <p className="text-xs text-base-content/60">document-level listener with cleanup — dropdown pattern</p>
                <div className="relative inline-block" ref={ref}>
                    <button className="btn btn-sm btn-primary" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
                        {open ? "Close" : "Open"} menu
                    </button>
                    {open && (
                        <ul className="menu bg-base-200 rounded-box absolute mt-2 w-44 z-10 border border-base-300 p-2 shadow-lg">
                            <li><button onClick={() => setOpen(false)}>Profile</button></li>
                            <li><button onClick={() => setOpen(false)}>Settings</button></li>
                            <li><button onClick={() => setOpen(false)}>Sign out</button></li>
                        </ul>
                    )}
                </div>
                <p className="text-xs text-base-content/60">Open it, then click anywhere else — it closes.</p>
            </div>
        </div>
    );
}

function DocumentTitleDemo() {
    const [title, setTitle] = useState("RTCS · Hooks");
    useDocumentTitle(title);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useDocumentTitle</h3>
                <p className="text-xs text-base-content/60">watch the browser tab title while typing</p>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Document title"
                />
            </div>
        </div>
    );
}

function IntervalDemo() {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(true);
    useInterval(() => setSeconds((s) => s + 1), running ? 1000 : null);

    return (
        <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
                <h3 className="card-title text-base">useInterval</h3>
                <p className="text-xs text-base-content/60">setInterval without stale closures — callback ref stays fresh</p>
                <div className="flex items-center gap-3">
                    <button className="btn btn-sm" onClick={() => setRunning((r) => !r)}>
                        {running ? "Pause" : "Resume"}
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => setSeconds(0)}>Reset</button>
                    <span className="text-sm font-mono bg-base-200 rounded-lg px-3 py-2">{seconds}s</span>
                </div>
            </div>
        </div>
    );
}

export default function HooksPage() {
    useDocumentTitle("RTCS · Hooks Playground");
    const isWide = useMediaQuery("(min-width: 768px)");

    const demos = useMemo(() => (
        <>
            <DebounceDemo />
            <PreviousDemo />
            <LocalStorageDemo />
            <MediaQueryDemo />
            <ApiDemo />
            <OnClickOutsideDemo />
            <DocumentTitleDemo />
            <IntervalDemo />
        </>
    ), []);

    return (
        <MainLayout>
            <div className={`grid gap-4 ${isWide ? "grid-cols-2" : "grid-cols-1"} text-left w-full`}>
                <div className={isWide ? "col-span-2" : ""}>
                    <h1 className="text-2xl font-bold">Hooks Playground</h1>
                    <p className="text-sm text-base-content/70 mb-2">
                        Eight custom hooks, live. Every one ships with a test.
                    </p>
                </div>
                {demos}
            </div>
        </MainLayout>
    );
}
