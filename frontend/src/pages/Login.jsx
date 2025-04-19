import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/apis";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
    const { fetchUser } = useAuth();
    const navigate = useNavigate();

    const [mode, setMode] = useState("password"); // "password" or "otp"
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        otp: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const startCountdown = () => {
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown((prev) => {
                if (prev === 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const sendOTP = async () => {
        if (!form.email || !form.email.includes("@")) {
            alert("📧 Enter a valid email");
            return;
        }

        try {
            await API.post("send-otp/", { email: form.email });
            alert("✅ OTP sent to your email");
            setOtpSent(true);
            startCountdown();
        } catch (err) {
            console.error("❌ Failed to send OTP:", err.response?.data || err.message);
            alert("❌ Failed to send OTP");
        }
    };

    const handleOTPLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("verify-otp/", {
                email: form.email,
                otp: form.otp
            });

            localStorage.setItem("chopchop-token", res.data.token);
            await fetchUser();
            alert("✅ Logged in via OTP!");
            navigate("/");
        } catch (err) {
            console.error("❌ OTP login failed:", err.response?.data || err.message);
            alert("❌ Invalid OTP");
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("login/", {
                username: form.username,
                password: form.password
            });

            localStorage.setItem("chopchop-token", res.data.access);
            await fetchUser();
            alert("✅ Logged in!");
            navigate("/");
        } catch (err) {
            console.error("❌ Password login failed:", err.response?.data || err.message);
            alert("❌ Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen bg-[url('/images/bg-food.jpg')] bg-cover flex items-center justify-center px-4">
            <form
                onSubmit={mode === "otp" ? handleOTPLogin : handlePasswordLogin}
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-bold text-center text-red-500">Login to ChopChop</h2>

                {mode === "password" ? (
                    <>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={form.username}
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
                    </>
                ) : (
                    <>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                        />
                        {otpSent && (
                            <input
                                type="text"
                                name="otp"
                                placeholder="Enter OTP"
                                value={form.otp}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                                required
                            />
                        )}
                        <button
                            type="button"
                            onClick={sendOTP}
                            disabled={countdown > 0}
                            className={`text-sm font-medium underline ${
                                countdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-red-500"
                            }`}
                        >
                            {otpSent
                                ? countdown > 0
                                    ? `Resend OTP in ${countdown}s`
                                    : "Resend OTP"
                                : "Send OTP"}
                        </button>
                    </>
                )}

                <button className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-md w-full font-medium">
                    {mode === "password" ? "Login with Password" : "Login with OTP"}
                </button>

                <p className="text-sm text-center text-gray-600">
                    {mode === "password" ? (
                        <>
                            Prefer OTP?{" "}
                            <span
                                onClick={() => setMode("otp")}
                                className="text-red-500 cursor-pointer font-medium"
                            >
                                Login via OTP
                            </span>
                        </>
                    ) : (
                        <>
                            Have a password?{" "}
                            <span
                                onClick={() => setMode("password")}
                                className="text-red-500 cursor-pointer font-medium"
                            >
                                Use Password
                            </span>
                        </>
                    )}
                </p>

                <p className="text-center text-gray-500 text-sm">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-red-500 font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}
