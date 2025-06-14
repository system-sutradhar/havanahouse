'use client';
import React from 'react';
import './HeaderMiddle.css';
const HeaderMiddle = () => {
  return (
    <div className="header-middle-wrapper">
      <div className="top-links">
        <ul>
          <li><button type="button" onClick={(e) => e.preventDefault()}>Help</button></li>
          <li><button type="button" onClick={(e) => e.preventDefault()}>Shipping & Returns</button></li>
          <li><button type="button" onClick={(e) => e.preventDefault()}>Store Locator</button></li>
          <li><button type="button" onClick={(e) => e.preventDefault()}>Contact Us</button></li>
        </ul>
      </div>
    </div>
  );
};

export default HeaderMiddle;
