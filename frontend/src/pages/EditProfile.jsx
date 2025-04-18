import { useState } from "react";
import API from "../api/apis";

export default function EditProfileModal({ user, onClose, onSave }) {
    const [form, setForm] = useState({
        name: user.name || "",
        email: user.email || "",
        mobile: user.mobile || "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await API.put("profile/", form); // 🔁 Update API endpoint
            alert("✅ Profile updated");
            onSave(res.data); // Update UI
            onClose(); // Close modal
        } catch (err) {
            console.error("Update error:", err);
            alert("❌ Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-md"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full p-3 border rounded-md"
                    required
                />
                <input
                    type="text"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number"
                    className="w-full p-3 border rounded-md"
                    required
                />
                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                        {loading ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </div>
    );
}
