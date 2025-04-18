import MenuCard from "../components/MenuCard";
import { useState } from "react";
import Modal from "../components/Modal"
const sampleItems = [
    {
        name: "Spicy Ramen",
        image: "https://source.unsplash.com/featured/?ramen",
        price: 12.99,
        description: "Delicious spicy ramen with rich broth.",
        category: "Noodles",
    },
    {
        name: "Sushi Platter",
        image: "https://source.unsplash.com/featured/?sushi",
        price: 18.49,
        description: "Fresh assorted sushi with wasabi and soy.",
        category: "Noodles",
    },
    {
        name: "Cheeseburger",
        image: "https://source.unsplash.com/featured/?burger",
        price: 9.99,
        description: "Juicy beef patty with melted cheese.",
        category: "Burger"
    },
    {
        name: "Sushi Platter",
        image: "https://source.unsplash.com/featured/?sushi",
        price: 18.49,
        description: "Fresh assorted sushi with wasabi and soy.",
        category: "Sushi",
    },
];


export default function Menu() {
    const [searchTerm, setSearchTerm] = useState("");
    const categories = ["All", "Noodles", "Burger", "Sushi"];
    const [selectedCategory, setSelectedCategory] = useState("All");

    const filteredItem = sampleItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            selectedCategory === "All" || item.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Menu</h1>
            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search for food..."
                className="w-full max-w-md mb-6 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex flex-wrap gap-3 mb-6">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium ${selectedCategory === cat
                            ? "bg-red-500 text-white border-red-500"
                            : "bg-white text-gray-700 border-gray-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            {/* Menu Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredItem.length > 0 ? (
                    filteredItem.map((item, index) => <MenuCard key={index} {...item} />)
                ) : (
                    <p className="text-gray-600 col-span-full">No items match your search.</p>
                )}
            </div>
        </div>
    );
}