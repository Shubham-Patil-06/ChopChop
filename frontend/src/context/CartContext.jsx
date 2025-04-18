import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const { user } = useAuth();
    const userCartKey = user ? `cart-${user.id}` : "cart-guest";

    const [cart, setCart] = useState([]);

    // Load cart from localStorage on mount and when user changes
    useEffect(() => {
        const saved = localStorage.getItem(userCartKey);
        setCart(saved ? JSON.parse(saved) : []);
    }, [user]);

    // Save cart when cart or user changes
    useEffect(() => {
        localStorage.setItem(userCartKey, JSON.stringify(cart));
    }, [cart, user]);

    const addToCart = (item) => {
        setCart((prevCart) => {
            const exists = prevCart.find((i) => i.name === item.name);
            if (exists) {
                return prevCart.map((i) =>
                    i.name === item.name ? { ...i, qty: i.qty + 1 } : i
                );
            }
            return [...prevCart, { ...item, qty: 1 }];
        });
    };

    const removeFromCart = (name) => {
        setCart((prevCart) => prevCart.filter((i) => i.name !== name));
    };

    const updateQty = (name, qty) => {
        if (qty < 1) return;
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.name === name ? { ...item, qty } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, updateQty, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
}
