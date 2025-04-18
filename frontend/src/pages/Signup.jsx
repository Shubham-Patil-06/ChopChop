import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        email: "",
        mobile: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(form);
            alert("✅ Account created and logged in!");
            navigate("/");
        } catch (err) {
            console.error("❌ Signup error:", err);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-[url('/images/bg-food.jpg')] bg-cover bg-center flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white bg-opacity-90 backdrop-blur p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-red-500">Create an Account</h2>

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                />

                <input
                    type="tel"
                    name="mobile"
                    placeholder="Mobile Number"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                    />
                    <span
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>

                <button className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-md w-full font-medium">
                    Sign Up
                </button>

                <p className="text-center text-gray-500 text-sm">
                    Already have an account?{" "}
                    <a href="/login" className="text-red-500 font-medium">
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
}
