'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaSearch, FaTimes } from 'react-icons/fa';
import defaultProductImg from "@/assets/images/pdp_default.png";
import './SearchOverlay.css';
import { fetchDataFromApi } from '@/utils/api';

const SearchOverlay = ({ isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  // Debounced API call for search suggestions
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }
    const handler = setTimeout(() => {
      fetchDataFromApi(`/api/search/suggest?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSuggestions(data);
          }
        })
        .catch(err => console.error("Search suggestion failed:", err));
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  if (!isVisible) {
    return null;
  }

  const handleClose = () => {
    setSearchQuery('');
    setSuggestions([]);
    onClose();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleClose();
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="search-overlay">
      <button className="overlay-close-button" onClick={handleClose} aria-label="Close search">
        <FaTimes />
      </button>

      <div className="search-overlay-content">
        <form className="overlay-search-form" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="overlay-search-input"
            placeholder="Search for cigars and more..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <button type="submit" className="overlay-search-button" aria-label="Search"><FaSearch /></button>
        </form>
        
        <div className="overlay-results">
          {suggestions.length > 0 && (
            <>
              <ul className="suggestions-list-overlay">
                {suggestions.map(item => (
                  <li key={`${item.type}-${item._id}`}>
                    {item.type === 'product' ? (
                      <Link href={`/product-new/${item._id}`} className="suggestion-item-overlay product" onClick={handleClose}>
                        <img 
                          src={(item.images?.[0] && item.images[0] !== 'https://via.placeholder.com/150') ? item.images[0] : defaultProductImg.src} 
                          alt={item.name} 
                          className="suggestion-image-overlay" 
                        />
                        <span className="suggestion-name-overlay">{item.name}</span>
                      </Link>
                    ) : (
                      <Link href={`/category/${item._id}`} className="suggestion-item-overlay category" onClick={handleClose}>
                        <span className="suggestion-name-overlay category-name">Search in category: {item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              {/* --- THIS IS THE FIX --- */}
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="view-all-results-overlay-button" onClick={handleClose}>
                View all results for "{searchQuery}"
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchOverlay;