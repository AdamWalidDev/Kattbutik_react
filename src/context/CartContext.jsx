import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const cartCount = cart.length;

  const addToCart = (cat) => {
    setCart((prev) => [...prev, cat]);
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
