import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"

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
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/contact">Contact</Link></li>
                    {isAuthenticated && <li><Link to="/dashboard">Dashboard</Link></li>}
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