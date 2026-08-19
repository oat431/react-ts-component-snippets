import { describe, it, expect } from "vitest";
import cartReducer, {
    addItem,
    decrementQty,
    incrementQty,
    removeItem,
    clearCart,
    selectCartCount,
    selectCartTotal,
} from "./cartSlice";
import type { RootState } from "./index";

const pizza = { id: "p1", name: "Keyboard", price: 100 };

const stateWith = (items: RootState["cart"]["items"]): RootState =>
    ({ cart: { items } }) as RootState;

describe("cartSlice reducers", () => {
    it("adds a new item with quantity 1", () => {
        const state = cartReducer(undefined, addItem(pizza));
        expect(state.items).toEqual([{ ...pizza, quantity: 1 }]);
    });

    it("increments quantity when the item already exists", () => {
        let state = cartReducer(undefined, addItem(pizza));
        state = cartReducer(state, addItem(pizza));
        expect(state.items[0]?.quantity).toBe(2);
        expect(state.items).toHaveLength(1);
    });

    it("decrementQty removes the item at zero", () => {
        let state = cartReducer(undefined, addItem(pizza));
        state = cartReducer(state, decrementQty("p1"));
        expect(state.items).toHaveLength(0);
    });

    it("incrementQty / removeItem / clearCart behave", () => {
        let state = cartReducer(undefined, addItem(pizza));
        state = cartReducer(state, addItem({ ...pizza, id: "p2" }));
        state = cartReducer(state, incrementQty("p1"));
        expect(state.items.find((i) => i.id === "p1")!.quantity).toBe(2);

        state = cartReducer(state, removeItem("p1"));
        expect(state.items.map((i) => i.id)).toEqual(["p2"]);

        state = cartReducer(state, clearCart());
        expect(state.items).toHaveLength(0);
    });

    it("selectors compute count and total", () => {
        const state = stateWith([
            { id: "p1", name: "A", price: 10, quantity: 2 },
            { id: "p2", name: "B", price: 5, quantity: 1 },
        ]);
        expect(selectCartCount(state)).toBe(3);
        expect(selectCartTotal(state)).toBe(25);
    });
});
