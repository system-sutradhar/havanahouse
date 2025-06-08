'use client';
import React, { useEffect, useState } from 'react';
import './NotificationBar.css'; // Importing the CSS file

const NotificationBar = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_APP_API_URL}/api/notification`)
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => console.error('Failed to load notification', err));
  }, []);

  if (!message) return null;

  return (
    <div className="notification-bar">{message}</div>
  );
};

export default NotificationBar;

