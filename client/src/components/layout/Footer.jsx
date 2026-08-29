import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-grid">
          {/* Logo and Description */}
          <div className="footer-info">
            <div className="footer-logo">
              <span className="logo-badge-text">SchemeSetu</span>
            </div>
            <p className="footer-desc">
              A centralized Central Government Scheme Discovery Platform. Search, filter, and verify eligibility for central welfare schemes across ministries in a clean, user-friendly portal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/browse">Browse Schemes</Link></li>
              <li><Link to="/find-schemes">Find Schemes for Me</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          {/* Government Portals */}
          <div className="footer-links-col">
            <h4>Official Portals</h4>
            <ul>
              <li><a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer">myScheme Portal</a></li>
              <li><a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer">National Portal of India</a></li>
              <li><a href="https://www.digitalindia.gov.in/" target="_blank" rel="noopener noreferrer">Digital India</a></li>
              <li><a href="https://dbtbharat.gov.in/" target="_blank" rel="noopener noreferrer">DBT Bharat</a></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="footer-links-col">
            <h4>Help & Contact</h4>
            <p className="contact-text">
              For any platform feedback, please write to us. Always consult the official government websites for the most up-to-date eligibility rules and documents.
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p className="disclaimer-text">
            <strong>Disclaimer:</strong> SchemeSetu is an independent educational and guidance platform. It is not affiliated with, associated with, sponsored by, or in any way officially connected with the Government of India, any state government, or any government ministry or department. All scheme information, logos, and links are retrieved from public domains and official portals for discovery purposes. SchemeSetu does not accept or process scheme applications directly.
          </p>
          <div className="copyright-bar">
            <span>&copy; {new Date().getFullYear()} SchemeSetu Project. All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
