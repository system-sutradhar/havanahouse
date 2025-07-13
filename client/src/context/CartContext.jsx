'use client';
import React, { createContext, useState, useEffect } from 'react';
import { toast } from "react-toastify";

// 1. Create the context with a default value to prevent errors if used outside a provider
export const CartContext = createContext({
  cartItems: [],
  addToCart: () => {},
  getCartCount: () => 0,
  // Add other functions with empty defaults
  removeFromCart: () => {},
  clearCart: () => {}
});

// 2. Create the Provider component with a named export
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage only on the client side
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('havana_cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('havana_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
    toast.success(`${product.name} has been added to your cart.`);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Define other cart functions
  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // 3. Provide the context value object
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    getCartCount // This is now guaranteed to be provided
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};