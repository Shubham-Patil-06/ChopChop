import { useEffect, useState } from "react";
import API from "../api/apis";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function PaymentPage() {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            document.body.appendChild(script);
        });

    const handlePayment = async () => {
        if (!user) {
            alert("User not loaded yet. Please wait...");
            return;
        }

        setLoading(true);
        await loadRazorpayScript();

        const amount = total * 100; // Convert ₹ to paisa
        const res = await API.post("payment/", { amount });

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: res.data.amount,
            currency: "INR",
            name: "ChopChop",
            description: "Order Payment",
            order_id: res.data.id,
            handler: async function (response) {
                try {
                    await API.post("orders/place/", {
                        total: total.toFixed(2),
                        address: user.address || "No address provided",
                        items: cart.map((item) => ({
                            name: item.name,
                            price: item.price,
                            quantity: item.qty,
                        })),
                    });

                    alert("✅ Order placed successfully!");
                    clearCart();
                    window.location.href = "/orders";
                } catch (err) {
                    console.error("Order placement failed:", err);
                    alert("❌ Payment went through but order save failed.");
                }
            },
            prefill: {
                name: user.username,
                email: user.email,
            },
            theme: {
                color: "#EF4444",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-100 p-6">
            <motion.h1
                className="text-4xl font-extrabold text-center text-red-600 mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                💳 Checkout & Payment
            </motion.h1>

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold text-gray-700 mb-3">🧾 Order Details</h2>
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="text-gray-700">
                                {item.name} × {item.qty}
                            </div>
                            <div className="font-semibold text-red-500">
                                ₹{(item.price * item.qty).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </motion.div>

                <motion.div
                    className="text-right text-xl font-bold text-green-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Total: ₹{total.toFixed(2)}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <button
                        onClick={handlePayment}
                        className={`px-8 py-3 rounded-full text-white text-lg font-semibold shadow-lg transition ${
                            loading ? "bg-gray-400" : "bg-red-500 hover:bg-red-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay with Razorpay 🛍️"}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
