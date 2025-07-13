'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { FaAngleRight, FaFacebook, FaYoutube, FaPhoneAlt, FaTimes } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import Logo from '../Logo';
import './Navigation.css';

const Navigation = ({ isMenuOpen, closeMenu }) => {
  const [showCat, setShowCat] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const catData = [
    { id: 1, name: 'Cuban Cigars' },
    { id: 2, name: 'New World Cigars' },
    { id: 3, name: 'Limited Editions' },
    { id: 4, name: 'Cigar Samplers' },
  ];

  return (
    <>
      {/* --- MOBILE-ONLY SIDEBAR WRAPPER & DRAWER --- */}
      {isMenuOpen && (
        <div className="navigation-wrapper-mobile" onClick={closeMenu}>
          <nav className="drawer-menu" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <Logo />
              <button className="drawer-close-button" onClick={closeMenu} aria-label="Close menu">
                <FaTimes />
              </button>
            </div>
            <div className="drawer-body">
              <ul className="drawer-section">
                <li className='drawer-list-item expandable' onClick={() => setShowCat(!showCat)}>
                  <span>Shop by Category</span> <FaAngleRight className={showCat ? 'expanded' : ''} />
                </li>
                {showCat &&
                  <div className='drawer-sub-menu'>
                    {catData.map((cat) => (
                      <Link key={cat.id} href={`/category/${cat.name.toLowerCase().replace(/ /g, '-')}`} onClick={closeMenu}>{cat.name}</Link>
                    ))}
                  </div>
                }
              </ul>
              <ul className="drawer-section">
                <li><Link href="/accessories" onClick={closeMenu}>Accessories</Link></li>
                <li><Link href="/about" onClick={closeMenu}>About Us</Link></li>
                <li><Link href="/stores" onClick={closeMenu}>Our Stores</Link></li>
                <li><Link href="/wishlist" onClick={closeMenu}>My Wishlist</Link></li>
                <li><Link href="/compare" onClick={closeMenu}>Compare Products</Link></li>
              </ul>
              <ul className="drawer-section">
                <li className='drawer-list-item expandable' onClick={() => setShowHelp(!showHelp)}>
                    <span>Customer Service</span> <FaAngleRight className={showHelp ? 'expanded' : ''} />
                </li>
                {showHelp &&
                    <div className='drawer-sub-menu'>
                        <Link href="/delivery" onClick={closeMenu}>Delivery Information</Link>
                        <Link href="/returns" onClick={closeMenu}>Return & Refunds</Link>
                        <Link href="/faq" onClick={closeMenu}>FAQs</Link>
                    </div>
                }
              </ul>
            </div>
            <div className="drawer-footer">
              <a href="tel:01753867453" className="contact-phone"><FaPhoneAlt /> 01753 867453</a>
              <div className="drawer-socials">
                <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
                <a href="https://x.com" aria-label="X"><FaXTwitter /></a>
                <a href="https://youtube.com" aria-label="Youtube"><FaYoutube /></a>
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* --- DESKTOP-ONLY NAVIGATION BAR --- */}
      <div className="desktop-nav-bar">
        <div className="desktop-nav-container">
          <Link href="/cigars">CIGARS</Link>
          <Link href="/tobacco">TOBACCO</Link>
          <Link href="/accessories">ACCESSORIES</Link>
          <Link href="/drinks">DRINKS</Link>
          <Link href="/pipes">PIPES</Link>
          <Link href="/offers">GIFTS & EVENTS</Link>
        </div>
      </div>
    </>
  );
};

export default Navigation;