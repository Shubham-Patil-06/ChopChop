import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const categories = [
    { name: "Pizza", img: "/images/pizza.avif" },
    { name: "Biryani", img: "/images/biryani.png" },
    { name: "Burgers", img: "/images/burger.png" },
    { name: "Desserts", img: "/images/Dessert.png" },
];

const topCategories = [
    { name: "Chinese", img: "/images/chinese.png" },
    { name: "South Indian", img: "/images/south_indian.jpg" },
    { name: "North Indian", img: "/images/north_indian.jpg" },
    { name: "Fast Food", img: "/images/fastfood.jpg" },
];

export default function Home() {
    const { user, loading } = useAuth();
    const { cart } = useCart();
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        document.body.className = darkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-800";
    }, [darkMode]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg animate-pulse font-semibold text-red-500">Cooking up something delicious...</p>
            </div>
        );
    }

    const headerTextClass = "text-4xl md:text-5xl font-bold mb-4 font-[Chewy]";

    return (
        <div className={`min-h-screen px-6 py-10 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50"}`}>
            {/* 🌗 Theme Toggle */}
            <div className="text-right mb-4">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition">
                    {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>
            </div>

            {!user ? (
                // 👤 Before Login
                <section className="text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={headerTextClass + " text-red-500"}
                    >
                        Craving something tasty?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl mb-6"
                    >
                        Discover and order your favorite food with ChopChop.
                    </motion.p>
                    <div className="space-x-4">
                        <Link to="/signup" className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition shadow">
                            Sign Up
                        </Link>
                        <Link to="/login" className="border border-red-500 text-red-500 px-6 py-3 rounded-full font-medium hover:bg-red-100 transition">
                            Log In
                        </Link>
                    </div>
                </section>
            ) : (
                // ✅ After Login
                <>
                    <motion.h2
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={headerTextClass}
                    >
                        🍽️ Welcome, {user.username || "Foodie"}!
                    </motion.h2>
                    <p className="mb-6 text-lg">Let’s make your cravings count.</p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { label: "Total Orders", value: user.orders_count || 0 },
                            { label: "Cart Items", value: cart.length || 0 },
                            { label: "Favorites", value: user.favorites_count || 0 },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <p className="text-gray-500 dark:text-gray-300">{stat.label}</p>
                                <p className="text-2xl font-semibold text-red-500">{stat.value}</p>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}

            {/* 🔥 Categories */}
            <section>
                <h3 className="text-3xl font-bold mb-4 font-[Chewy] text-red-400">Popular Cravings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow hover:shadow-lg text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <img src={cat.img} alt={cat.name} className="w-full h-32 object-cover rounded-md" />
                            <p className="mt-2 font-semibold text-red-500">{cat.name}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 🎉 CTA */}
            {user && (
                <motion.div
                    className="mt-10 p-8 rounded-2xl text-center shadow-lg bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h4 className="text-2xl font-semibold mb-2">Hungry already?</h4>
                    <p className="mb-4">Browse our delicious menu and start your feast 🍜</p>
                    <Link to="/menu" className="bg-white text-red-500 px-6 py-2 rounded-lg hover:bg-red-100 transition font-semibold">
                        Browse Menu
                    </Link>
                </motion.div>
            )}
        </div>
    );
}
