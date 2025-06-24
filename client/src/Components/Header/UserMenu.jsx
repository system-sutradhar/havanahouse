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
      <a
        href="#"
        className="icon-link"
        role="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.preventDefault();
          setOpen(!open);
        }}
        aria-label="User menu"
      >
        <FaUser />
      </a>
      {open && (
        <div className="user-dropdown" role="menu">
          <div className="user-dropdown-header">
            {isLogin ? (
              <span>My Account</span>
            ) : (
              <span className="signin-links">
                <Link href="/signIn">Sign In</Link> | <Link href="/join">Join</Link>
              </span>
            )}
            <button className="close-btn" onClick={() => setOpen(false)} aria-label="Close menu">&times;</button>
          </div>
          <ul>
          {isLogin ? (
            <>
              <li>
                <Link href="/account">
                  <FaUser className="menu-icon" /> <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link href="/account/orders">
                  <FaBoxOpen className="menu-icon" /> <span>My Orders</span>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <FaUndo className="menu-icon" /> <span>Returns Information</span>
                </Link>
              </li>
              <li>
                <Link href="/account/preferences">
                  <FaEnvelope className="menu-icon" /> <span>Contact Preferences</span>
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
                  <FaUser className="menu-icon" /> <span>My Account</span>
                </Link>
              </li>
              <li>
                <Link href="/signIn?redirect=orders">
                  <FaBoxOpen className="menu-icon" /> <span>My Orders</span>
                </Link>
              </li>
              <li>
                <Link href="/returns">
                  <FaUndo className="menu-icon" /> <span>Returns Information</span>
                </Link>
              </li>
              <li>
                <Link href="/signIn?redirect=preferences">
                  <FaEnvelope className="menu-icon" /> <span>Contact Preferences</span>
                </Link>
              </li>
            </>
          )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
