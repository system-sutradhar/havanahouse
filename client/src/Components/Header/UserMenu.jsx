"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaUser, FaBoxOpen, FaUndo, FaEnvelope } from "react-icons/fa";

const UserMenu = ({ isLogin }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        className="icon-link"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        aria-label="User menu"
      >
        <FaUser />
      </button>
      {open && (
        <ul className="user-dropdown" role="menu">
          {isLogin ? (
            <>
              <li>
                <Link href="/account">
                  <FaUser className="menu-icon" /> My Account
                </Link>
              </li>
              <li>
                <Link href="/account/orders">
                  <FaBoxOpen className="menu-icon" /> My Orders
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <FaUndo className="menu-icon" /> Returns Information
                </Link>
              </li>
              <li>
                <Link href="/account/preferences">
                  <FaEnvelope className="menu-icon" /> Contact Preferences
                </Link>
              </li>
              <li>
                <Link href="/logout">Sign Out</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/signIn?redirect=account">
                  <FaUser className="menu-icon" /> My Account
                </Link>
              </li>
              <li>
                <Link href="/signIn?redirect=orders">
                  <FaBoxOpen className="menu-icon" /> My Orders
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <FaUndo className="menu-icon" /> Returns Information
                </Link>
              </li>
              <li>
                <Link href="/signIn?redirect=preferences">
                  <FaEnvelope className="menu-icon" /> Contact Preferences
                </Link>
              </li>
              <li>
                <Link href="/signIn">Sign In / Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
