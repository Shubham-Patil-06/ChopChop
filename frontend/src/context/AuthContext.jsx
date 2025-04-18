// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/apis";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem("chopchop-token");
        if (!token) return setLoading(false);
        try {
            const res = await API.get("profile/", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data);
        } catch (err) {
            console.error("❌ Failed to fetch user profile:", err);
            localStorage.removeItem("chopchop-token");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = async (username, password) => {
        const res = await API.post("login/", { username, password });
        localStorage.setItem("chopchop-token", res.data.access);
        await fetchUser();
    };

    const register = async (formData) => {
        const res = await API.post("signup/", formData);
        const token = res.data.token || res.data.access;
        localStorage.setItem("chopchop-token", token);
        await fetchUser();
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("chopchop-token");
    };

    const contextValue = {
        user,
        loading,
        login,
        logout,
        register, // ✅ Added this line
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
