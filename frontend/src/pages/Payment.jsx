import { useEffect, useState } from "react";
import API from "../api/apis";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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
            key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ✅ Use from .env
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
                    window.location.href = "/orders"; // or dashboard
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
        <div className="min-h-screen bg-gray-50 p-8">
            <h2 className="text-2xl font-bold mb-4">Confirm & Pay</h2>
            <ul className="mb-6 space-y-2">
                {cart.map((item) => (
                    <li key={item.name} className="flex justify-between">
                        <span>{item.name} × {item.qty}</span>
                        <span>₹{item.price * item.qty}</span>
                    </li>
                ))}
            </ul>
            <div className="text-xl font-bold mb-6">Total: ₹{total.toFixed(2)}</div>
            <button
                onClick={handlePayment}
                className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600"
                disabled={loading}
            >
                {loading ? "Processing..." : "Pay with Razorpay"}
            </button>
        </div>
    );
}
