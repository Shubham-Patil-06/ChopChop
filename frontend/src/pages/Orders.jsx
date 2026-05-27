import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../api/apis";

const STATUS_COLORS = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    preparing: "bg-orange-100 text-orange-700",
    delivering: "bg-purple-100 text-purple-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const STATUS_LABELS = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    delivering: "Out for Delivery",
    completed: "Delivered",
    cancelled: "Cancelled",
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        API.get("orders/")
            .then((res) => setOrders(res.data))
            .catch(() => setError("Failed to load orders. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-100">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-100">
                <div className="text-center text-red-600 text-lg">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-100 p-6">
            <motion.h1
                className="text-4xl font-extrabold text-center text-red-600 mb-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                Your Orders
            </motion.h1>

            {orders.length === 0 ? (
                <motion.div
                    className="text-center text-gray-500 text-lg mt-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <p className="text-5xl mb-4">🍽️</p>
                    <p>No orders yet. Start ordering!</p>
                </motion.div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-4">
                    {orders.map((order, i) => (
                        <motion.div
                            key={order.id}
                            className="bg-white rounded-xl shadow-md overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            {/* Order header */}
                            <button
                                className="w-full text-left p-5 flex justify-between items-center"
                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                            >
                                <div>
                                    <p className="font-bold text-gray-800">Order #{order.id}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(order.created_at).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-green-600">
                                        &#8377;{parseFloat(order.total).toFixed(2)}
                                    </span>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}>
                                        {STATUS_LABELS[order.status] || order.status}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        {expanded === order.id ? "▲" : "▼"}
                                    </span>
                                </div>
                            </button>

                            {/* Expandable items */}
                            <AnimatePresence>
                                {expanded === order.id && (
                                    <motion.div
                                        key="content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="border-t px-5 pb-5"
                                    >
                                        {order.items && order.items.length > 0 ? (
                                            <ul className="mt-4 space-y-2">
                                                {order.items.map((item, j) => (
                                                    <li key={j} className="flex justify-between text-sm text-gray-700">
                                                        <span>{item.name} &times; {item.quantity}</span>
                                                        <span className="text-red-500 font-medium">
                                                            &#8377;{(parseFloat(item.price) * item.quantity).toFixed(2)}
                                                        </span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="mt-4 text-sm text-gray-400">No item details available.</p>
                                        )}
                                        {order.address && (
                                            <p className="mt-4 text-xs text-gray-500">
                                                <span className="font-semibold">Delivered to: </span>
                                                {order.address.address}
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
