import { useDispatch, useSelector } from "react-redux";
import MainLayout from "../layouts/Section.tsx";
import RenderCount from "../components/RenderCount.tsx";
import { addItem, decrementQty, incrementQty, removeItem, clearCart, selectCartItems, selectCartTotal } from "../store/cartSlice.ts";

// Static product catalog — the point is the state flow, not the data.
const PRODUCTS = [
    { id: "p1", name: "Mechanical Keyboard", price: 1500 },
    { id: "p2", name: "USB-C Hub", price: 890 },
    { id: "p3", name: '27" 4K Monitor', price: 12500 },
    { id: "p4", name: "Webcam 1080p", price: 1650 },
    { id: "p5", name: "Desk Mat", price: 450 },
];

export default function CartPage() {
    const dispatch = useDispatch();
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartTotal);

    return (
        <MainLayout>
            <div className="w-full max-w-3xl text-left">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Cart — RTK Demo</h1>
                    <RenderCount label="page renders" />
                </div>
                <p className="text-sm text-base-content/70 mb-4">
                    Auth uses Context (low-frequency, ~once per session). The cart uses Redux Toolkit
                    (high-churn, every click) — <code>useSelector</code> means only components selecting
                    changed slices re-render.
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* Product list */}
                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body">
                            <h2 className="card-title text-base">Products</h2>
                            <ul className="flex flex-col gap-2">
                                {PRODUCTS.map((p) => (
                                    <li key={p.id} className="flex items-center justify-between bg-base-200 rounded-lg px-3 py-2">
                                        <div>
                                            <span className="text-sm font-medium">{p.name}</span>
                                            <span className="text-xs text-base-content/60 ml-2">฿{p.price.toLocaleString()}</span>
                                        </div>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => dispatch(addItem(p))}
                                        >
                                            + Add
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Cart contents */}
                    <div className="card bg-base-100 border border-base-300">
                        <div className="card-body">
                            <div className="flex items-center justify-between">
                                <h2 className="card-title text-base">Cart</h2>
                                {items.length > 0 && (
                                    <button className="btn btn-ghost btn-xs" onClick={() => dispatch(clearCart())}>
                                        Clear
                                    </button>
                                )}
                            </div>
                            {items.length === 0 && (
                                <p className="text-sm text-base-content/60">Empty — add something.</p>
                            )}
                            <ul className="flex flex-col gap-2">
                                {items.map((item) => (
                                    <li key={item.id} className="bg-base-200 rounded-lg px-3 py-2 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{item.name}</span>
                                            <span className="text-xs text-base-content/60">
                                                ฿{item.price.toLocaleString()} × {item.quantity} = ฿{(item.price * item.quantity).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button className="btn btn-xs" onClick={() => dispatch(decrementQty(item.id))}>−</button>
                                            <button className="btn btn-xs" onClick={() => dispatch(incrementQty(item.id))}>+</button>
                                            <button className="btn btn-xs btn-error btn-outline" onClick={() => dispatch(removeItem(item.id))}>✕</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {items.length > 0 && (
                                <div className="border-t border-base-300 pt-2 mt-2 flex justify-between items-center">
                                    <span className="text-sm font-semibold">Total</span>
                                    <span className="text-lg font-bold text-primary">฿{total.toLocaleString()}</span>
                                    <button className="btn btn-neutral btn-sm">Checkout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
