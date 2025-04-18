// src/pages/Checkout.jsx
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export default function Checkout() {
    const { cart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [address, setAddress] = useState("");

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    useEffect(() => {
        const saved = localStorage.getItem("chopchop-address");
        if (saved) setAddress(saved);
    }, []);

    const handleProceed = () => {
        if (!address.trim()) {
            alert("Please enter a delivery address.");
            return;
        }
        localStorage.setItem("chopchop-address", address);
        navigate("/payment");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6">🧾 Checkout</h1>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Cart Summary */}
                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <h2 className="text-xl font-semibold mb-2">Your Order</h2>
                    {cart.length === 0 ? (
                        <p>Your cart is empty.</p>
                    ) : (
                        <>
                            <ul className="divide-y">
                                {cart.map((item) => (
                                    <li
                                        key={item.name}
                                        className="py-2 flex justify-between text-sm"
                                    >
                                        <span>{item.name} × {item.qty}</span>
                                        <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="text-lg font-bold">
                                Total: ₹{total.toFixed(2)}
                            </div>
                        </>
                    )}
                </div>

                {/* Delivery Address */}
                <div className="bg-white p-6 rounded-xl shadow space-y-4">
                    <h2 className="text-xl font-semibold">Delivery Address</h2>
                    <textarea
                        rows={6}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your delivery address"
                        className="w-full p-3 border rounded-md resize-none"
                    />
                    <button
                        onClick={handleProceed}
                        className="bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-lg"
                    >
                        Proceed to Payment
                    </button>
                </div>
            </div>
        </div>
    );
}
