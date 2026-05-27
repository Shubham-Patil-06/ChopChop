import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/apis";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

export default function PaymentPage() {
    const { cart, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const address = localStorage.getItem("chopchop-address") || "";

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if (window.Razorpay) { resolve(); return; }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = resolve;
            document.body.appendChild(script);
        });

    const handlePayment = async () => {
        if (!user) {
            alert("Please log in to continue.");
            return;
        }
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return;
        }
        if (!address.trim()) {
            alert("Please go back and enter a delivery address.");
            navigate("/checkout");
            return;
        }

        setLoading(true);
        try {
            await loadRazorpayScript();

            const amountInPaisa = Math.round(total * 100);
            const res = await API.post("payment/", { amount: amountInPaisa });

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
                            address: address,
                            items: cart.map((item) => ({
                                name: item.name,
                                price: item.price,
                                quantity: item.qty,
                            })),
                        });

                        clearCart();
                        localStorage.removeItem("chopchop-address");
                        navigate("/orders");
                    } catch (err) {
                        console.error("Order placement failed:", err);
                        alert("Payment succeeded but order save failed. Please contact support.");
                    }
                },
                prefill: {
                    name: user.first_name || user.username,
                    email: user.email,
                },
                theme: { color: "#EF4444" },
                modal: {
                    ondismiss: () => setLoading(false),
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Payment error:", err);
            alert("Failed to initiate payment. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-100 p-6">
            <motion.h1
                className="text-4xl font-extrabold text-center text-red-600 mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Checkout & Payment
            </motion.h1>

            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg space-y-6">
                {address && (
                    <motion.div
                        className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-gray-700"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <span className="font-semibold">Delivering to: </span>{address}
                    </motion.div>
                )}

                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="text-xl font-bold text-gray-700 mb-3">Order Details</h2>
                    {cart.map((item, i) => (
                        <div key={i} className="flex justify-between items-center border-b pb-2">
                            <div className="text-gray-700">
                                {item.name} &times; {item.qty}
                            </div>
                            <div className="font-semibold text-red-500">
                                &#8377;{(item.price * item.qty).toFixed(2)}
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
                    Total: &#8377;{total.toFixed(2)}
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
                            loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Pay with Razorpay"}
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
