import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Leafy_lure</h3>
          <p>Pure Organic Henna Crafted Naturally</p>
        </div>
        <div className="footer-details">
          <div className="footer-item">
            <span className="icon">📍</span>
            {/* REPLACE THIS PLACEHOLDER WITH YOUR LOCATION */}
            <p>Nadapuram, Kerala, India</p>
          </div>
          <div className="footer-item">
            <span className="icon">📸</span>
            {/* REPLACE THIS PLACEHOLDER WITH YOUR INSTAGRAM ID AND LINK */}
            <a href="https://www.instagram.com/leafy_lure?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
              @leafy_lure
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Leafy_lure. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
