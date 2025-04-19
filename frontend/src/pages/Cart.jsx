import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import emptyCartLottie from "../assets/empty-lottie.json";
import Lottie from "lottie-react";

export default function Cart() {
    const { cart, removeFromCart, updateQty } = useCart();
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    if (cart.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-red-100 p-6">
                <Lottie animationData={emptyCartLottie} className="w-80 h-80" loop />
                <h2 className="text-xl text-gray-600 mt-4 font-medium">Your cart is empty. Add something tasty! 🍔🍕</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-100 p-6">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-extrabold text-red-600 mb-6 text-center"
            >
                🛒 Your Delicious Cart
            </motion.h1>

            <div className="space-y-4">
                {cart.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between bg-white p-4 rounded-xl shadow-lg"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded-full object-cover border-2 border-red-300"
                            />
                            <div>
                                <h2 className="font-bold text-lg text-gray-800">{item.name}</h2>
                                <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                min="1"
                                value={item.qty}
                                onChange={(e) => updateQty(item.name, parseInt(e.target.value))}
                                className="w-16 border border-red-300 rounded-md px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-red-400"
                            />
                            <button
                                onClick={() => removeFromCart(item.name)}
                                className="text-sm text-red-500 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto text-center"
            >
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Total: ${total.toFixed(2)}</h3>
                <button
                    onClick={() => navigate("/checkout")}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full text-lg font-semibold shadow transition-transform hover:scale-105"
                >
                    Proceed to Checkout 🚀
                </button>
            </motion.div>
        </div>
    );
}
