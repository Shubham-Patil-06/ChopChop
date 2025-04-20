import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function OrderSummary() {
    const { cart, setCart } = useCart();
    const [address, setAddress] = useState(() => {
        return localStorage.getItem("chopchop-address") || "";
    });
    const navigate = useNavigate();

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    useEffect(() => {
        if (cart.length === 0) {
            navigate("/menu");
        }
    }, [cart, navigate]);

    const handlePlaceOrder = () => {
        if (address.trim() === "") {
            alert("🚫 Please enter a delivery address.");
            return;
        }

        alert("🎉 Your order has been placed!\n📍 Delivery to:\n" + address);
        setCart([]);
        localStorage.removeItem("chopchop-cart");
        navigate("/");
    };

    return (
        <div className="p-6 bg-gradient-to-br from-yellow-50 to-red-100 min-h-screen">
            <motion.h1
                className="text-4xl font-extrabold mb-8 text-center text-red-600"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                🧾 Order Summary
            </motion.h1>

            <div className="space-y-6 max-w-3xl mx-auto">
                {cart.map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex items-center justify-between bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover border"
                            />
                            <div>
                                <h2 className="font-semibold text-gray-800">{item.name}</h2>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.qty} | ${item.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <span className="font-bold text-red-500 text-lg">
                            ${(item.price * item.qty).toFixed(2)}
                        </span>
                    </motion.div>
                ))}

                {/* Total Amount */}
                <motion.div
                    className="text-xl font-bold text-right text-green-600"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    🧮 Total: ${total.toFixed(2)}
                </motion.div>

                {/* Delivery Address Input */}
                <motion.div
                    className="bg-white p-6 rounded-xl shadow space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h2 className="text-lg font-semibold text-red-500">🏠 Delivery Address</h2>
                    <textarea
                        value={address}
                        onChange={(e) => {
                            setAddress(e.target.value);
                            localStorage.setItem("chopchop-address", e.target.value);
                        }}
                        className="w-full p-3 border rounded-md resize-none h-28 focus:ring-2 focus:ring-red-300"
                        placeholder="e.g. 123 Pizza Street, Near Burger Point 🍕"
                    />
                </motion.div>

                {/* Place Order Button */}
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition"
                        onClick={handlePlaceOrder}
                    >
                        🛵 Place Order
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
