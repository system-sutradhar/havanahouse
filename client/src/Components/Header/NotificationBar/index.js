'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUser } from 'react-icons/fa';
import './NotificationBar.css';

const NotificationBar = () => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/notification`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.message) {
          setNotification(data);
        }
      })
      .catch((err) => console.error('Failed to load notification:', err));
  }, []);

  return (
    <div className="notification-bar">
      <div className="notification-bar-container">
        {/* Div for the left-aligned message */}
        <div className="notification-message">
          {notification && (
            notification.link ? (
              <Link href={notification.link}>{notification.message}</Link>
            ) : (
              <span>{notification.message}</span>
            )
          )}
        </div>
        
        {/* Div for the right-aligned user action */}
        <div className="notification-user-action">
          <Link href="/signIn">
            <FaUser className="user-icon" />
            <span>Login | Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotificationBar;