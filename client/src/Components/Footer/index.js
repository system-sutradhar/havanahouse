import React from 'react';
import Link from 'next/link';
// Using react-icons for all icons
import { FaFacebook, FaInstagram, FaYoutube, FaPhoneAlt, FaWhatsapp, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import './footer.css';

const Footer = () => {
  // Array of stores to make it easier to manage
  const stores = [
    { name: 'Bath', href: '/stores/bath' },
    { name: 'Birmingham', href: '/stores/birmingham' },
    { name: 'Cardiff', href: '/stores/cardiff' },
    { name: 'Hove', href: '/stores/hove' },
    { name: 'Oxford', href: '/stores/oxford' },
    { name: 'Reading', href: '/stores/reading' },
    { name: 'Southampton', href: '/stores/southampton' },
    { name: 'Stratford-upon-Avon', href: '/stores/stratford' },
    { name: 'Windsor', href: '/stores/windsor' },
    { name: 'Windsor Lounge', href: '/stores/windsor-lounge' },
  ];

  // Split stores into two columns for a balanced layout
  const halfwayPoint = Math.ceil(stores.length / 2);
  const storesColumn1 = stores.slice(0, halfwayPoint);
  const storesColumn2 = stores.slice(halfwayPoint);

  return (
    <footer className="footer">
      <div className="container footer-container">
        {/* --- Subscription Section --- */}
        <div className="subscription-section">
          <div className="subscription-content">
            <h3 className="subscription-heading">Stay up to date with the latest Havana House news</h3>
            <p className="subscription-subheading">Sign up for discounts, news, and more!</p>
          </div>
          <form className="subscription-form">
            <input type="email" placeholder="Your email address" className="subscription-input" />
            <button type="submit" className="subscription-button">Sign Up</button>
          </form>
        </div>

        <div className="footer-body">
          {/* --- Main Link Columns (now 4 columns) --- */}
          <div className="footer-links-main">
            <div className="footer-column">
              <h3 className="footer-heading">Useful Information</h3>
              <ul className="footer-links">
                <li><Link href="/faq">FAQ’s</Link></li>
                <li><Link href="/jobs">Job vacancies</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/delivery">Delivery information</Link></li>
                <li><Link href="/returns">Return & refunds</Link></li>
              </ul>
            </div>

            {/* --- Stores Column 1 --- */}
            <div className="footer-column">
              <h3 className="footer-heading">Our Stores</h3>
              <ul className="footer-links">
                {storesColumn1.map(store => (
                  <li key={store.name}><Link href={store.href}>{store.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* --- Stores Column 2 (no heading for visual continuation) --- */}
            <div className="footer-column">
              <h3 className="footer-heading">&nbsp;</h3> {/* Empty heading for alignment */}
              <ul className="footer-links">
                {storesColumn2.map(store => (
                  <li key={store.name}><Link href={store.href}>{store.name}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-heading">My Account</h3>
              <ul className="footer-links">
                <li><Link href="/myAccount">My account</Link></li>
                <li><Link href="/orders">Order help</Link></li>
                <li><Link href="/rewards">Reward points</Link></li>
                <li><Link href="/policy/privacy">Privacy policy</Link></li>
                <li><Link href="/policy/terms">Terms & conditions</Link></li>
              </ul>
            </div>
          </div>

          {/* --- Contact Sidebar --- */}
          <div className="footer-contact-side">
            <h3 className="footer-heading">Contact Center</h3>
            <ul className="footer-links contact-details">
              <li><a href="tel:01753867453"><FaPhoneAlt /> 01753 867453</a></li>
              <li><a href="https://wa.me/447903638256"><FaWhatsapp /> +44 7903 638256</a></li>
              <li><a href="mailto:info@havanahouse.co.uk"><MdEmail /> info@havanahouse.co.uk</a></li>
            </ul>
            <div className="social-icons">
              <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
              <a href="https://x.com" aria-label="X" target="_blank" rel="noopener noreferrer"><FaXTwitter /></a>
              <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://youtube.com" aria-label="Youtube" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>
        </div>

        {/* --- Bottom Bar --- */}
        <div className="footer-bottom">
          <p className="copyright">© {new Date().getFullYear()} Havana House. All Rights Reserved.</p>
          <div className="payment-methods">
              <FaCcVisa />
              <FaCcMastercard />
              <FaCcPaypal />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;