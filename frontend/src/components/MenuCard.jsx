import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";
import { FaCartPlus } from "react-icons/fa";

export default function MenuCard({ name, image, price, description, onCardClick }) {
    const { addToCart } = useCart();

    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden w-full sm:w-[300px] cursor-pointer group transform transition-transform"
        >
            <div className="relative overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    onClick={onCardClick}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    Popular
                </div>
            </div>

            <div className="p-4">
                <h2
                    onClick={onCardClick}
                    className="text-xl font-extrabold text-gray-800 hover:text-red-500 transition-colors"
                >
                    {name}
                </h2>
                <p className="text-gray-600 text-sm mt-1 line-clamp-3">{description}</p>

                <div className="mt-4 flex justify-between items-center">
                    <span className="text-red-500 font-bold text-lg">${price}</span>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => addToCart({ name, image, price, description })}
                        className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
                    >
                        <FaCartPlus /> Add
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
