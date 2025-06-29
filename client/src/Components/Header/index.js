'use client';
import React, { useState, useEffect } from 'react';
import NotificationBar from './NotificationBar';
import HeaderMiddle from './HeaderMiddle';
import Navigation from './Navigation';
import SearchBox from './SearchBox'; // For the mobile search overlay

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const body = document.body;
    if (isMenuOpen || isSearchOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }
  }, [isMenuOpen, isSearchOpen]);

  const closeAllOverlays = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  };

  const toggleMenu = () => {
    setIsSearchOpen(false);
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsMenuOpen(false);
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="header-main-wrapper">
      <NotificationBar />
      <HeaderMiddle
        isMenuOpen={isMenuOpen}
        toggleMenu={toggleMenu}
        toggleSearch={toggleSearch} // This will now be for mobile only
      />
      <Navigation isMenuOpen={isMenuOpen} closeMenu={closeAllOverlays} />
      {isSearchOpen && <SearchBox closeSearch={closeAllOverlays} />}
    </header>
  );
};

export default Header;