"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

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
      >
        My Account
      </button>
      {open && (
        <ul className="user-dropdown" role="menu">
          {isLogin ? (
            <>
              <li><Link href="/account">My Account</Link></li>
              <li><Link href="/account/orders">My Orders</Link></li>
              <li><Link href="/returns">Returns Information</Link></li>
              <li><Link href="/account/preferences">Contact Preferences</Link></li>
              <li><Link href="/logout">Sign Out</Link></li>
            </>
          ) : (
            <li><Link href="/login">Sign In / Sign Up</Link></li>
          )}
        </ul>
      )}
    </div>
  );
};

export default UserMenu;
