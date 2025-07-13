'use client';
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUser, FaHeart, FaShoppingBag, FaSearch, FaBars, FaExchangeAlt } from 'react-icons/fa';
import { BsGrid3X3Gap } from "react-icons/bs";

import Logo from '../Logo';
import { CartContext } from '@/context/CartContext';
import { AppContext } from '@/context/AppContext';
import { fetchDataFromApi } from '@/utils/api';
import defaultProductImg from "@/assets/images/pdp_default.png";
import './HeaderMiddle.css';

const HeaderMiddle = ({ toggleMenu, toggleSearch, toggleSignIn }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { getCartCount } = useContext(CartContext);
  const { toggleSignInPopup } = useContext(AppContext);
  const searchContainerRef = useRef(null);
  const debounceTimeout = useRef(null);

  // Debounced API call logic
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceTimeout.current = setTimeout(() => {
      // Corrected the API call to directly use the response
      fetchDataFromApi(`/api/search/suggest?q=${encodeURIComponent(searchQuery)}`)
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
    }, 300);
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
      <div className="container header-middle-container">
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
                {suggestions.map(item => (
                  <li key={`${item.type}-${item._id}`}>
                    {item.type === 'product' ? (
                      <Link href={`/product-new/${item._id}`} className="suggestion-item product" onClick={handleSuggestionClick}>
                        <img 
                          src={(item.images?.[0] && item.images[0] !== 'https://via.placeholder.com/150') ? item.images[0] : defaultProductImg.src} 
                          alt={item.name} 
                          className="suggestion-image"
                        />
                        <span className="suggestion-name">{item.name}</span>
                        {item.price && (
                          <span className="suggestion-price">£{item.price.toFixed(2)}</span>
                        )}
                      </Link>
                    ) : (
                      <Link href={`/category/${item._id}`} className="suggestion-item category" onClick={handleSuggestionClick}>
                        <span className="suggestion-name category-name">Search in: {item.name}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
              <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="view-all-results-button" onClick={handleSuggestionClick}>
                View all results for "{searchQuery}"
              </Link>
            </div>
          )}
          <div className="logo-mobile-container"><Logo /></div>
        </div>
        
        <div className="header-right">
          <button className="action-icon icon-button mobile-search-toggle" onClick={toggleSearch}>
            <FaSearch />
          </button>
          <button className="action-icon icon-button" aria-label="Sign In" onClick={toggleSignIn}>
            <FaUser />
          </button>
          <div className="icon-separator desktop-only"></div>
          <Link href="/compare" className="action-icon desktop-only" aria-label="Compare Products"><FaExchangeAlt /></Link>
          <div className="icon-separator desktop-only"></div>
          <Link href="/wishlist" className="action-icon desktop-only" aria-label="Wishlist"><FaHeart /></Link>
          <div className="icon-separator desktop-only"></div>
          <Link href="/cart" className="action-icon" aria-label="Shopping Bag">
            <FaShoppingBag />
            {getCartCount() > 0 && (
              <span className="cart-count">{getCartCount()}</span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderMiddle;