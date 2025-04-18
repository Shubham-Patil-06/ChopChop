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

        // Set profile fields
        setProfileInfo({
            name: user.name || user.username || "",
            email: user.email || "",
            mobile: user.phone || user.mobile ||""
        });
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        alert("🚪 Logged out");
        navigate("/");
    };

    const handleSaveProfile = (updatedInfo) => {
        setProfileInfo(updatedInfo);
        // Optionally call API to update user on backend
        console.log("Profile updated:", updatedInfo);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* 🔷 Banner & Avatar */}
            <div className="relative bg-cover bg-center h-56 bg-[url('/images/profile-banner.jpg')]">
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-white">
                    <div className="rounded-full border-4 border-white overflow-hidden w-24 h-24">
                        <img
                            src="/images/avatar-placeholder.png"
                            alt="avatar"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <h2 className="text-white text-xl font-semibold mt-2">
                        {profileInfo.name || profileInfo.mobile}
                    </h2>
                    <button
                        onClick={() => setShowEdit(true)}
                        className="mt-2 bg-red-500 hover:bg-red-600 px-4 py-1 rounded-lg text-sm"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {/* 📝 Profile Content */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-gray-600">📞 Mobile Number</h3>
                        <p className="font-medium">{profileInfo.mobile || "Not Provided"}</p>
                    </div>
                    <div>
                        <h3 className="text-gray-600">📧 Email</h3>
                        <p className="font-medium">{profileInfo.email || "Not Provided"}</p>
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-gray-600">🏠 Saved Address</h3>
                        <textarea
                            value={address}
                            onChange={(e) => {
                                setAddress(e.target.value);
                                localStorage.setItem("chopchop-address", e.target.value);
                            }}
                            className="w-full p-3 border rounded-md resize-none h-24"
                            placeholder="Add your delivery address here"
                        />
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="mt-8 bg-red-500 hover:bg-red-600 text-white w-full py-3 rounded-lg transition"
                >
                    Logout
                </motion.button>
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
