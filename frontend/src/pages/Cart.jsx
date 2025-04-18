import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
export default function Cart() {
    const { cart, removeFromCart, updateQty } = useCart();

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const navigate = useNavigate();
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
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
                                        <p className="text-sm text-gray-500">${item.price}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.qty}
                                        onChange={(e) => updateQty(item.name, parseInt(e.target.value))}
                                        className="w-16 border rounded px-2 py-1 text-center"
                                    />
                                    <button
                                        onClick={() => navigate("/checkout")}
                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                                    >
                                        Proceed to Checkout
                                    </button>

                                    <button
                                        onClick={() => removeFromCart(item.name)}
                                        className="text-red-500 hover:underline"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        className="  text-black px-6 py-2 rounded-xl text-lg font-medium"
                                        onClick={() => navigate("/summary")}
                                    >summary</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 text-xl font-bold">
                        Total: ${total.toFixed(2)}
                    </div>
                </>
            )}
        </div>
    );
}
