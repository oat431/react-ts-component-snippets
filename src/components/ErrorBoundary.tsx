import React from "react";

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    /** Changing these resets the boundary — lets a parent retry on new props. */
    resetKeys?: unknown[];
}

interface State {
    error: Error | null;
}

/**
 * ErrorBoundary — class components are STILL the only way to catch render
 * errors in a subtree (no hook equivalent exists). Catches render/lifecycle/
 * constructor errors below it; does NOT catch event handlers, async code,
 * or SSR — those need try/catch or event handlers of their own.
 */
export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Real apps: report to Sentry/telemetry here
        console.error("ErrorBoundary caught:", error, info.componentStack);
    }

    componentDidUpdate(prev: Props) {
        if (
            this.state.error &&
            prev.resetKeys?.some((k, i) => k !== this.props.resetKeys?.[i])
        ) {
            this.setState({ error: null });
        }
    }

    render() {
        if (this.state.error) {
            return (
                this.props.fallback ?? (
                    <div className="alert alert-error" role="alert">
                        <span>Something went wrong: {this.state.error.message}</span>
                        <button
                            className="btn btn-sm"
                            onClick={() => this.setState({ error: null })}
                        >
                            Try again
                        </button>
                    </div>
                )
            );
        }
        return this.props.children;
    }
}
