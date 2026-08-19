import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore, type Store } from "@reduxjs/toolkit";
import cartReducer from "../store/cartSlice";
import { AuthProvider } from "../context/AuthContext";

/**
 * Test utility: render a component with ALL app providers
 * (Router + Redux + Auth). Pages that render MainLayout pull in the
 * NavBar, whose CartBadge subscribes to the store — so every page-level
 * test needs the full provider stack, exactly like the real app tree.
 *
 * Pass `preloadedState` or a custom `store` for store-dependent tests.
 */
interface Options extends Omit<RenderOptions, "wrapper"> {
    route?: string;
    store?: Store;
}

export function renderWithProviders(ui: ReactElement, { route = "/", store }: Options = {}) {
    const testStore =
        store ??
        configureStore({
            reducer: { cart: cartReducer },
        });

    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <Provider store={testStore}>
                <AuthProvider>
                    <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
                </AuthProvider>
            </Provider>
        );
    }

    return { store: testStore, ...render(ui, { wrapper: Wrapper }) };
}
