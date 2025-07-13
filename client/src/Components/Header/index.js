"use client";
import React, { useState } from "react";
import HeaderMiddle from "./HeaderMiddle";
import Navigation from "./Navigation";
import NotificationBar from "./NotificationBar";
import SearchOverlay from "../SearchOverlay";
import SignInPopup from "../SignInPopup"; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false);
  // --- THIS IS THE FIX: State is now managed here ---
  const [isSignInPopupVisible, setIsSignInPopupVisible] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOverlayVisible(!isSearchOverlayVisible);
  // This function will now be passed directly as a prop
  const toggleSignInPopup = () => setIsSignInPopupVisible(!isSignInPopupVisible);

  return (
    <>
      <header className="header">
        <NotificationBar />
        {/* Pass the toggle function down to HeaderMiddle */}
        <HeaderMiddle 
          toggleMenu={toggleMenu} 
          toggleSearch={toggleSearch} 
          toggleSignIn={toggleSignInPopup} 
        />
      </header>
      <Navigation isMenuOpen={isMenuOpen} closeMenu={toggleMenu} />
      <SearchOverlay isVisible={isSearchOverlayVisible} onClose={toggleSearch} />
      {/* The popup receives its state and close function as props */}
      <SignInPopup isVisible={isSignInPopupVisible} onClose={toggleSignInPopup} />
    </>
  );
};

export default Header;