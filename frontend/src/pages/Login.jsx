import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ✅
import API from "../api/apis";

export default function Login() {
    const { login } = useAuth(); // ✅ use context login
    const [mode, setMode] = useState("password");
    const [form, setForm] = useState({ username: "", email: "", password: "", otp: "" });
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();

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
            alert("📧 Enter a valid email address");
            return;
        }

        try {
            await API.post("send-otp/", { email: form.email });
            setOtpSent(true);
            alert("✅ OTP sent to your email");
            startCountdown();
        } catch {
            alert("❌ Failed to send OTP");
        }
    };

    const handleOTPLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post("verify-otp/", {
                email: form.email,
                otp: form.otp,
            });
            localStorage.setItem("chopchop-token", res.data.token);
            await login(); // ✅ fetch user after OTP login
            // alert("✅ Logged in via OTP!");
            navigate("/");
        } catch {
            alert("❌ Invalid OTP");
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        try {
            await login(form.username, form.password); // ✅ use context login
            // alert("✅ Logged in!");
            navigate("/");
        } catch {
            alert("❌ Invalid username or password");
        }
    };

    return (
        <div className="min-h-screen bg-[url('/images/bg-food.jpg')] bg-cover flex items-center justify-center p-4">
            <form
                onSubmit={mode === "otp" ? handleOTPLogin : handlePasswordLogin}
                className="bg-white p-8 rounded-xl shadow w-full max-w-md space-y-5"
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
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
                        />
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
                                required
                                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-red-400"
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

                <button
                    type="submit"
                    className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-md w-full"
                >
                    {mode === "password" ? "Login with Password" : "Login with OTP"}
                </button>

                <p className="text-sm text-gray-600 text-center">
                    {mode === "password" ? (
                        <>
                            Prefer OTP?{" "}
                            <span
                                onClick={() => setMode("otp")}
                                className="text-red-500 font-medium cursor-pointer"
                            >
                                Login via OTP
                            </span>
                        </>
                    ) : (
                        <>
                            Have a password?{" "}
                            <span
                                onClick={() => setMode("password")}
                                className="text-red-500 font-medium cursor-pointer"
                            >
                                Use Password
                            </span>
                        </>
                    )}
                </p>

                <p className="text-center text-gray-400 text-sm">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-red-500 font-medium">
                        Sign up
                    </Link>
                </p>
            </form>
        </div>
    );
}


