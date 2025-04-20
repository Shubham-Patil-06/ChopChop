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
        <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100">
            {/* 🍽️ Banner Section */}
            <div className="relative bg-[url('/images/profile-banner.jpg')] bg-cover bg-center h-60">
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="rounded-full border-4 border-white overflow-hidden w-24 h-24 shadow-lg"
                    >
                        <img
                            src="/images/avatar-placeholder.png"
                            alt="User Avatar"
                            className="object-cover w-full h-full"
                        />
                    </motion.div>
                    <h2 className="text-xl font-bold mt-3">{profileInfo.name || profileInfo.mobile}</h2>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        className="mt-2 bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full text-sm shadow-md transition"
                        onClick={() => setShowEdit(true)}
                    >
                        ✏️ Edit Profile
                    </motion.button>
                </div>
            </div>

            {/* 📝 Profile Info Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl mx-auto p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow-xl">
                    <div>
                        <h3 className="text-red-500 font-semibold mb-1">📱 Mobile</h3>
                        <p className="text-gray-700 font-medium">{profileInfo.mobile || "Not Provided"}</p>
                    </div>
                    <div>
                        <h3 className="text-red-500 font-semibold mb-1">📧 Email</h3>
                        <p className="text-gray-700 font-medium">{profileInfo.email || "Not Provided"}</p>
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

                {/* 🔓 Logout Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="mt-8 bg-gradient-to-r from-red-400 to-red-600 text-white w-full py-3 rounded-full font-bold text-lg shadow hover:shadow-lg"
                >
                    Logout 🍔
                </motion.button>
            </motion.div>

            {/* ✨ Edit Modal */}
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
