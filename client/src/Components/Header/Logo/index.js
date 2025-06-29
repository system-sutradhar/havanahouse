import React from 'react';
import Link from 'next/link';
import './Logo.css';

const Logo = () => {
  return (
    <div className="logo-wrapper">
      <Link href="/" aria-label="Havana House Home">
        {/* Increased viewBox height from 85 to 95 for more vertical space */}
        <svg className="logo-svg modern-wordmark-stacked" viewBox="0 0 200 95">
          <text className="logo-main-text" x="50%" y="28%" dominantBaseline="middle" textAnchor="middle">
            HAVANA
          </text>
          <text className="logo-sub-text" x="50%" y="60%" dominantBaseline="middle" textAnchor="middle">
            HOUSE
          </text>
          <text className="logo-tagline-text" x="50%" y="90%" dominantBaseline="middle" textAnchor="middle">
            CIGAR MERCHANT
          </text>
        </svg>
      </Link>
    </div>
  );
};

export default Logo;