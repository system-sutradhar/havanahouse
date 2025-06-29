'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaHeart, FaShoppingBag, FaSearch, FaBars } from 'react-icons/fa';
import { BsGrid3X3Gap } from "react-icons/bs";
import Logo from '../Logo';
import './HeaderMiddle.css';

const HeaderMiddle = ({ isMenuOpen, toggleMenu, toggleSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchContainerRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Debounced API call logic
  useEffect(() => {
    // Clear any existing timer
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set a new timer
    debounceTimeout.current = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/search/suggest?q=${encodeURIComponent(searchQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setSuggestions(data.slice(0, 10));
            setShowSuggestions(data.length > 0);
          }
        })
        .catch(() => {
          setSuggestions([]);
          setShowSuggestions(false);
        });
    }, 300); // 300ms delay

    // Cleanup on component unmount
    return () => clearTimeout(debounceTimeout.current);
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = () => {
    setShowSuggestions(false);
    setSearchQuery('');
  };

  return (
    <div className="header-middle">
      <div className="header-middle-container">
        {/* --- LEFT, CENTER, AND RIGHT COLUMNS --- */}
        <div className="header-left">
          <button className="menu-toggle icon-button" onClick={toggleMenu} aria-label="Toggle menu"><FaBars /></button>
          <div className="desktop-logo-catalog-wrapper">
            <Logo />
            <button className="catalog-button" onClick={toggleMenu}>
              <BsGrid3X3Gap className="catalog-icon" />
              <span>Catalogue</span>
            </button>
          </div>
        </div>

        <div className="header-center" ref={searchContainerRef}>
          <form className="desktop-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Search for cigars, brands, and more..."
              className="desktop-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
              autoComplete="off"
            />
            <button type="submit" className="desktop-search-button" aria-label="Search"><FaSearch /></button>
          </form>

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-suggestions-drawer">
              <ul className="suggestions-list">
                {suggestions.map(product => (
                  <li key={product._id}>
                    {/* --- THIS IS THE FIX --- */}
                    {/* The link now uses the correct product._id */}
                    <Link href={`/product/${product._id}`} className="suggestion-item" onClick={handleSuggestionClick}>
                      <img 
                        src={(product.images && product.images.length > 0) ? product.images[0] : '/images/default-cigar-placeholder.png'} 
                        alt={product.name || 'Product Image'} 
                        className="suggestion-image"
                      />
                      <span className="suggestion-name">{product.name}</span>
                      {product.price && typeof product.price === 'number' && (
                        <span className="suggestion-price">£{product.price.toFixed(2)}</span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="view-all-results-button" onClick={handleSuggestionClick}>
                View all results
              </Link>
            </div>
          )}

          <div className="logo-mobile-container"><Logo /></div>
        </div>
        
        <div className="header-right">
          <button className="action-icon icon-button mobile-search-toggle" onClick={toggleSearch} aria-label="Search"><FaSearch /></button>
          <Link href="/signIn" className="action-icon" aria-label="Sign In"><FaUser /></Link>
          <div className="icon-separator"></div>
          <Link href="/wishlist" className="action-icon" aria-label="Wishlist"><FaHeart /></Link>
          <div className="icon-separator"></div>
          <Link href="/cart" className="action-icon" aria-label="Shopping Bag">
            <FaShoppingBag /><span className="cart-count">0</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderMiddle;