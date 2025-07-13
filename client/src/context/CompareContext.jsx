'use client';
import { createContext, useState, useEffect } from 'react';

export const CompareContext = createContext();

// This line is the fix. We are using a named export.
export const CompareProvider = ({ children }) => {
    const [compareList, setCompareList] = useState([]);

    useEffect(() => {
        const savedCompare = localStorage.getItem('compareList');
        if (savedCompare) {
            setCompareList(JSON.parse(savedCompare));
        }
    }, []);

    const addToCompare = (product) => {
        if (compareList.length >= 4) {
            alert("You can only compare up to 4 products.");
            return;
        }
        const updatedList = [...compareList, product];
        setCompareList(updatedList);
        localStorage.setItem('compareList', JSON.stringify(updatedList));
    };

    const removeFromCompare = (productId) => {
        const updatedList = compareList.filter(item => item._id !== productId);
        setCompareList(updatedList);
        localStorage.setItem('compareList', JSON.stringify(updatedList));
    };

    const isInCompare = (productId) => {
        return compareList.some(item => item._id === productId);
    };

    return (
        <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare }}>
            {children}
        </CompareContext.Provider>
    );
};