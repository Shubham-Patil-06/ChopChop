import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "./EditProfile";

export default function Profile() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [address, setAddress] = useState("");
    const [showEdit, setShowEdit] = useState(false);
    const [profileInfo, setProfileInfo] = useState({
        name: "",
        email: "",
        mobile: ""
    });

    useEffect(() => {
        if (!user) {
            alert("Please log in to view your profile.");
            navigate("/login");
            return;
        }

        const savedAddress = localStorage.getItem("chopchop-address");
        setAddress(savedAddress || "");

        setProfileInfo({
            name: user.name || user.username || "",
            email: user.email || "",
            mobile: user.phone || user.mobile || ""
        });
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        alert("👋 See you soon, foodie!");
        navigate("/");
    };

    const handleSaveProfile = (updatedInfo) => {
        setProfileInfo(updatedInfo);
        console.log("Profile updated:", updatedInfo);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-100">
            {/* 🍽️ Profile Header */}
            <div className="relative bg-[url('/images/profile-banner.jpg')] bg-cover bg-center h-64">
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-full border-4 border-white overflow-hidden w-28 h-28 shadow-lg"
                    >
                        <img
                            src="/images/avatar-placeholder.png"
                            alt="User Avatar"
                            className="object-cover w-full h-full"
                        />
                    </motion.div>
                    <h2 className="text-2xl font-bold mt-3 tracking-wide">{profileInfo.name || profileInfo.mobile}</h2>
                    <p className="text-sm text-gray-200 mt-1 italic">🥢 Foodie since 2025</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-3 bg-red-500 hover:bg-red-600 px-5 py-1 rounded-full text-sm font-medium shadow"
                        onClick={() => setShowEdit(true)}
                    >
                        ✏️ Edit Profile
                    </motion.button>
                </div>
            </div>

            {/* 💫 Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto p-6 space-y-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    {[
                        { label: "Orders", value: user.orders_count || 0, emoji: "🧾" },
                        { label: "Favorites", value: user.favorites_count || 0, emoji: "❤️" },
                        { label: "Reviews", value: user.reviews_count || 3, emoji: "⭐" }, // hardcoded example
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            className="bg-white rounded-xl shadow-lg py-6 px-4 hover:shadow-xl transition-all"
                            whileHover={{ scale: 1.05 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-3xl">{stat.emoji}</div>
                            <h4 className="mt-2 text-gray-700 font-bold text-lg">{stat.value}</h4>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* 📝 Info Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-2xl shadow-xl">
                    <div>
                        <h3 className="text-red-500 font-semibold mb-1">📱 Mobile</h3>
                        <p className="text-gray-800 font-medium">{profileInfo.mobile || "Not Provided"}</p>
                    </div>
                    <div>
                        <h3 className="text-red-500 font-semibold mb-1">📧 Email</h3>
                        <p className="text-gray-800 font-medium">{profileInfo.email || "Not Provided"}</p>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-red-500 font-semibold mb-1">🏠 Delivery Address</h3>
                        <textarea
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                localStorage.setItem("chopchop-address", e.target.value);
                            }}
                            className="w-full p-3 border rounded-lg h-24 resize-none focus:ring-2 focus:ring-red-400"
                            placeholder="Add your favorite food delivery spot"
                        />
                    </div>
                </div>

                {/* 🛑 Logout */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-pink-500 to-red-500 text-white w-full py-3 rounded-full font-bold text-lg shadow-md"
                >
                    🚪 Logout
                </motion.button>

                {/* 💬 Sample Reviews Section */}
                <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">🍽️ Your Reviews</h3>
                    <div className="bg-white rounded-lg p-4 shadow-sm space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i}>
                                <p className="font-medium text-gray-700">“Loved the spicy biryani! Will order again 😍”</p>
                                <p className="text-sm text-gray-400">— ChopChop User</p>
                            </div>
                        ))}
                        <p className="text-sm text-red-400 italic">More review history coming soon...</p>
                    </div>
                </div>
            </motion.div>

            {/* ✏️ Edit Modal */}
            {showEdit && (
                <EditProfileModal
                    user={profileInfo}
                    onClose={() => setShowEdit(false)}
                    onSave={handleSaveProfile}
                />
            )}
        </div>
    );
}
