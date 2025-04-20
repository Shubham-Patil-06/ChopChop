import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderCheckout() {
    const { cart, setCart } = useCart();
    const { user } = useAuth();
    const [address, setAddress] = useState(() => localStorage.getItem("chopchop-address") || "");
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    useEffect(() => {
        if (!user) {
            alert("Please login to proceed.");
            navigate("/login");
        } else if (cart.length === 0) {
            navigate("/menu");
        }
    }, [user, cart, navigate]);

    const handleProceedToPayment = () => {
        if (!address.trim()) {
            alert("🚫 Please enter a delivery address.");
            return;
        }

        localStorage.setItem("chopchop-address", address);
        navigate("/payment");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-100 p-6">
            <motion.h1
                className="text-4xl font-extrabold text-center text-red-600 mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                🍽️ Order Summary & Checkout
            </motion.h1>

            <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {/* 🛍️ Cart Summary */}
                <motion.div
                    className="bg-white rounded-xl shadow-lg p-6 space-y-5"
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2 className="text-xl font-bold text-gray-700">🛒 Your Items</h2>
                    {cart.map((item, i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">
                                        Qty: {item.qty} | ₹{item.price.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <div className="text-red-500 font-bold">
                                ₹{(item.price * item.qty).toFixed(2)}
                            </div>
                        </div>
                    ))}

                    <div className="text-xl font-bold text-right text-green-600">
                        🧮 Total: ₹{total.toFixed(2)}
                    </div>
                </motion.div>

                {/* 📍 Address & Payment */}
                <motion.div
                    className="bg-white rounded-xl shadow-lg p-6 space-y-5"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-xl font-bold text-gray-700">🏠 Delivery Address</h2>
                    <textarea
                        rows={6}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address (e.g. 123 Pizza Street)"
                        className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-red-400"
                    />

                    <button
                        onClick={handleProceedToPayment}
                        className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-lg font-bold text-lg shadow-md transition"
                    >
                        🛵 Proceed to Payment
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
