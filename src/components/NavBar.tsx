import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { useSelector } from "react-redux"
import { selectCartCount } from "../store/cartSlice"

// Isolated badge component — subscribes ONLY to the cart count slice.
// Cart changes re-render THIS, not the whole navbar: useSelector isolation.
function CartBadge() {
    const count = useSelector(selectCartCount);
    if (count === 0) return null;
    return (
        <span className="badge badge-sm badge-primary indicator-item" aria-label={`${count} items in cart`}>
            {count}
        </span>
    );
}

function NavBar() {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    }

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">RTCS</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1 items-center">
                    <li><Link to="/hooks">Hooks</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                    <li><Link to="/performance">Perf</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
                    <li className="indicator">
                        <CartBadge />
                        <Link to="/cart" aria-label="Cart">🛒</Link>
                    </li>
                    {!isAuthenticated ? (
                        <li><Link to="/login" className="btn btn-sm btn-primary ml-2">Login</Link></li>
                    ) : (
                        <li><button onClick={handleLogout} className="btn btn-sm btn-outline ml-2">Logout</button></li>
                    )}
                </ul>
            </div>
        </div>
    )
}

export default NavBar
