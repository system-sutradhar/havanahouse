// client/src/Components/Header/SearchBox/index.js

'use client';
import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './SearchBox.css';

const SearchBox = ({ closeSearch }) => {
  return (
    <div className="search-overlay">
      <button className="close-search-button" onClick={closeSearch} aria-label="Close search">
        <FaTimes />
      </button>
      <div className="search-overlay-content">
        <form className="search-overlay-form">
          <input type="text" autoFocus placeholder="Search for products..." />
          <button type="submit"><FaSearch /></button>
        </form>
      </div>
    </div>
  );
};

export default SearchBox;