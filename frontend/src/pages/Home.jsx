import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

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

    // ⏳ Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-lg text-gray-600">Fetching your personalized menu...</p>
            </div>
        );
    }

    // 👤 BEFORE LOGIN
    if (!user) {
        return (
            <div className="min-h-screen bg-white">
                <section className="bg-[url('/images/bg-food.jpg')] bg-cover bg-center text-white py-24 px-6 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-4"
                    >
                        Craving something delicious?
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl"
                    >
                        Discover the best food in your city with ChopChop.
                    </motion.p>
                    <div className="mt-6 space-x-4">
                        <Link to="/signup" className="bg-white text-red-500 px-6 py-3 rounded-full font-semibold shadow hover:bg-red-100">
                            Sign Up
                        </Link>
                        <Link to="/login" className="border border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-red-500">
                            Log In
                        </Link>
                    </div>
                </section>

                <section className="py-16 px-6 text-center bg-gray-50">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Explore food by category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {categories.map((cat, i) => (
                            <motion.div
                                key={cat.name}
                                className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <img src={cat.img} alt={cat.name} className="w-full h-32 object-cover" />
                                <div className="p-4 font-semibold text-gray-700">{cat.name}</div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        );
    }

    // ✅ AFTER LOGIN
    return (
        <div className="min-h-screen bg-gray-50 px-6 py-10">
            <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-red-500 mb-1"
            >
                🍽️ Welcome, {user.username || user.name || "Guest"}!
            </motion.h2>
            <p className="text-gray-600 mb-6">
                {user.email ? `Logged in as ${user.email}` : "Enjoy your delicious journey!"}
            </p>

            {/* 📦 STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: "Total Orders", value: user.orders_count || 0 },
                    { label: "Cart Items", value: cart.length || 0 },
                    { label: "Favorite Dishes", value: user.favorites_count || 0 },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className="bg-white p-6 rounded-2xl shadow-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <p className="text-gray-500">{stat.label}</p>
                        <p className="text-2xl font-semibold text-red-500">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* 🏷️ TOP CATEGORIES */}
            <section className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Top Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {topCategories.map((cat, i) => (
                        <motion.div
                            key={cat.name}
                            className="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <img src={cat.img} alt={cat.name} className="w-full h-32 object-cover" />
                            <div className="p-3 text-center font-medium text-gray-700">
                                {cat.name}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* 📲 CALL TO ACTION */}
            <div className="bg-white p-8 rounded-2xl text-center shadow">
                <h4 className="text-xl font-semibold mb-2 text-gray-800">Hungry already?</h4>
                <p className="text-gray-600 mb-4">Check out our full menu or browse your favorites.</p>
                <Link to="/menu" className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition">
                    Browse Menu
                </Link>
            </div>
        </div>
    );
}
