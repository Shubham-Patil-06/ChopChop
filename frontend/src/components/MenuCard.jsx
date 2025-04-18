import { useCart } from "../context/CartContext";

export default function MenuCard({ name, image, price, description, onCardClick }) {
    const { addToCart } = useCart();

    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full sm:w-[300px]">
            <img
                src={image}
                alt={name}
                className="w-full h-48 object-cover cursor-pointer"
                onClick={onCardClick}
            />
            <div className="p-4">
                <h2
                    onClick={onCardClick}
                    className="text-xl font-bold text-gray-800 cursor-pointer hover:underline"
                >
                    {name}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-red-500 font-semibold">${price}</span>
                    <button
                        onClick={() => addToCart({ name, image, price, description })}
                        className="bg-red-500 text-white px-3 py-1 rounded-xl hover:bg-red-600"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
