"use client";
import { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext();

const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) setWishlist(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const addWishlist = (product) => {
    setWishlist((prev) => {
      if (prev.find((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeWishlist = (id) => {
    setWishlist((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addWishlist, removeWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistProvider;
