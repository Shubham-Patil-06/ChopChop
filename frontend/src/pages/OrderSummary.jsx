import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Order Summary</h1>

            <div className="space-y-4">
                {cart.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 rounded object-cover"
                            />
                            <div>
                                <h2 className="font-semibold">{item.name}</h2>
                                <p className="text-sm text-gray-500">
                                    Qty: {item.qty} &nbsp;|&nbsp; ${item.price.toFixed(2)}
                                </p>
                            </div>
                        </div>
                        <span className="font-bold text-red-500">
                            ${(item.price * item.qty).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-xl font-bold">
                Total: ${total.toFixed(2)}
            </div>
            <div className="mt-6 bg-white p-4 rounded-xl shadow space-y-2">
                <h2 className="text-lg font-semibold">Delivery Address</h2>
                <textarea

                    onChange={(e) => {
                        setAddress(e.target.value);
                        localStorage.setItem("chopchop-address", e.target.value);
                    }}

                />
            </div>

            <div className="mt-6">
                <button
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl text-lg font-medium"
                    onClick={handlePlaceOrder}
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}
