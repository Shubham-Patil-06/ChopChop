import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import Lottie from "lottie-react";
import MenuCard from "../components/MenuCard";
import emptyAnimation from "../assets/empty-lottie.json";

const sound = new Howl({
    src: ["/sounds/click.mp3"],
    volume: 0.2,
});

const sampleItems = [
    {
        name: "Spicy Ramen",
        image: "/images/spicy_ramen.avif",
        price: 12.99,
        description: "Delicious spicy ramen with rich broth.",
        category: "Noodles",
    },
    {
        name: "Sushi Platter",
        image: "/images/sushi.avif",
        price: 18.49,
        description: "Fresh assorted sushi with wasabi and soy.",
        category: "Sushi",
    },
    {
        name: "Cheeseburger",
        image: "/images/burger.png",
        price: 9.99,
        description: "Juicy beef patty with melted cheese.",
        category: "Burger"
    },
    {
        name: "Veggie Noodles",
        image: "/images/veggies_noodles.avif",
        price: 10.49,
        description: "Healthy veggie-packed noodles.",
        category: "Noodles"
    }
];

// Randomly pick 1 item to be Chef's Special
const specials = [Math.floor(Math.random() * sampleItems.length)];

export default function Menu() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [items, setItems] = useState(sampleItems);

    const categories = ["All", "Noodles", "Burger", "Sushi"];

    const filteredItems = items.filter((item) => {
        const matchText = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCat = selectedCategory === "All" || item.category === selectedCategory;
        return matchText && matchCat;
    });

    const handleCategoryClick = (cat) => {
        setSelectedCategory(cat);
        sound.play();
    };

    return (
        <div className="p-6 bg-gradient-to-b from-yellow-100 via-red-100 to-pink-100 min-h-screen">
            {/* 🍽️ Hero Section */}
            <motion.h1
                className="text-4xl font-extrabold text-red-600 text-center mb-4"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Explore Our Delicious Menu
            </motion.h1>

            <motion.p
                className="text-center text-gray-700 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                Search, filter, and enjoy your favorite dishes 🍜🍣🍔
            </motion.p>

            {/* 🔍 Search */}
            <motion.div
                className="flex justify-center mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
            >
                <input
                    type="text"
                    placeholder="Search for food..."
                    className="w-full max-w-md p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </motion.div>

            {/* 🍽️ Categories */}
            <motion.div
                className="flex flex-wrap justify-center gap-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className={`px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${selectedCategory === cat
                                ? "bg-red-500 text-white border-red-500"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-red-100"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </motion.div>

            {/* 🍱 Menu Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredItems.length > 0 ? (
                        filteredItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {specials.includes(index) && (
                                    <div className="absolute top-0 left-0 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-br-xl z-10">
                                        👨‍🍳 Chef’s Special
                                    </div>
                                )}
                                <MenuCard {...item} />
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            className="col-span-full flex flex-col items-center justify-center mt-10"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <Lottie animationData={emptyAnimation} style={{ height: 200 }} />
                            <p className="text-gray-600 mt-4 text-lg">
                                Oops! No food matches your search.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
