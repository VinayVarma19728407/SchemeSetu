import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => (
  <div className="not-found-page">
    <div className="nf-content">
      <h1 className="nf-code">404</h1>
      <h2 className="nf-heading">Page Not Found</h2>
      <p className="nf-text">The page you are looking for doesn't exist or has been moved.</p>
      <div className="nf-actions">
        <Link to="/" className="btn btn-primary">Return Home</Link>
        <Link to="/browse" className="btn btn-outline-dark">Browse Schemes</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
