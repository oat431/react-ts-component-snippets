import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

/**
 * cartSlice — high-churn shared state demo (RTK).
 *
 * Contrast with auth: AuthContext changes ~once per session (low-frequency),
 * so Context fits there. The cart changes on EVERY click — with Context every
 * consumer would re-render; with useSelector only components selecting the
 * changed slice re-render. That contrast is the whole point of this demo.
 *
 * Reducers look mutable but are wrapped in Immer — they produce new state
 * under the hood (immutable updates without the spread ceremony).
 */
const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItem: (state, action: PayloadAction<{ id: string; name: string; price: number }>) => {
            const existing = state.items.find((i) => i.id === action.payload.id);
            if (existing) {
                existing.quantity += 1; // Immer: safe "mutation"
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((i) => i.id !== action.payload);
        },
        incrementQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) item.quantity += 1;
        },
        decrementQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find((i) => i.id === action.payload);
            if (item) {
                item.quantity -= 1;
                if (item.quantity <= 0) {
                    state.items = state.items.filter((i) => i.id !== action.payload);
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addItem, removeItem, incrementQty, decrementQty, clearCart } = cartSlice.actions;

// Selectors — components subscribe to SLICES, not the whole store.
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
export const selectCartCount = (state: RootState) =>
    state.cart.items.reduce((sum, i) => sum + i.quantity, 0);

export default cartSlice.reducer;
