"use client";
import { createContext, useState, useEffect } from "react";

export const CompareContext = createContext();

const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("compare");
    if (stored) setCompareItems(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareItems));
  }, [compareItems]);

  const addToCompare = (product) => {
    setCompareItems((prev) => {
      if (prev.find((p) => p._id === product._id)) return prev;
      return [...prev, product];
    });
  };

  const removeCompare = (id) => {
    setCompareItems((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeCompare }}>
      {children}
    </CompareContext.Provider>
  );
};

export default CompareProvider;
