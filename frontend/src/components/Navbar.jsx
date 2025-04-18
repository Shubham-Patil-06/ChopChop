import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        alert("🚪 Logged out");
        navigate("/");
    };

    const isLoggedIn = !!user;

    return (
        <nav className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Left: Logo + Location */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-2xl font-bold text-red-500 flex items-center gap-1">
                        🍜 ChopChop
                    </Link>
                    <div className="hidden sm:flex items-center text-sm text-gray-600 gap-1">
                        <FaMapMarkerAlt className="text-red-500" />
                        <span>Bangalore, India</span>
                    </div>
                </div>

                {/* Center: Search Bar
                <div className="flex-1 flex items-center max-w-xl mx-auto w-full">
                    <div className="flex items-center bg-gray-100 px-3 py-2 rounded-full w-full shadow-sm">
                        <FaSearch className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search for dishes or restaurants"
                            className="w-full bg-transparent outline-none text-sm"
                        />
                    </div>
                </div> */}

                {/* Right: Navigation */}
                <div className="flex items-center gap-4 text-sm mt-2 sm:mt-0">
                    <Link to="/menu" className="hover:text-red-500 font-medium">
                        Menu
                    </Link>

                    {isLoggedIn && (
                        <>
                            <Link to="/cart" className="hover:text-red-500 font-medium">
                                Cart
                            </Link>
                            <Link to="/profile" className="hover:text-red-500 font-medium">
                                Profile
                            </Link>
                        </>
                    )}

                    {!isLoggedIn ? (
                        <Link
                            to="/login"
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition"
                        >
                            Login
                        </Link>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full transition"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
