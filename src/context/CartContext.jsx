import { useState } from 'react';
import { CartContext } from './cartContextObject';

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
