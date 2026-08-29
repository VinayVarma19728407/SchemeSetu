import React, { useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import './EligibilityResult.css';

const EligibilityResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useContext(BookmarkContext);

  const resultData = location.state;

  if (!resultData) {
    // If no state exists (user navigated here directly), return to browse
    navigate('/browse');
    return null;
  }

  const { result, scheme } = resultData;
  const { status, passedConditions: passed = [], failedConditions: failed = [] } = result || {};
  const bookmarked = isBookmarked ? isBookmarked(scheme?.id) : false;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/scheme/' + scheme?.slug);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="eligibility-result-wrapper">
      <h1 className="eligibility-result-title">Eligibility Result</h1>
      <h2 className="eligibility-scheme-name">{scheme?.name}</h2>

      {status === 'Eligible' && (
        <div className="result-banner success-banner">
          <span className="icon">✅</span>
          <p>Congratulations! You appear eligible for this scheme.</p>
        </div>
      )}

      {status === 'Not Eligible' && (
        <div className="result-banner error-banner">
          <span className="icon">❌</span>
          <p>Based on the information provided, you are currently not eligible.</p>
        </div>
      )}

      {status === 'Possibly Eligible' && (
        <div className="result-banner warning-banner">
          <span className="icon">⚠️</span>
          <p>You may be eligible. Some information was incomplete.</p>
        </div>
      )}

      <div className="conditions-section">
        {passed.length > 0 && (
          <div className="conditions-list">
            <h3>Passed Conditions</h3>
            <ul>
              {passed.map((cond, i) => (
                <li key={i} className="passed-cond">✅ {cond}</li>
              ))}
            </ul>
          </div>
        )}

        {failed.length > 0 && (
          <div className="conditions-list">
            <h3>Failed/Missing Conditions</h3>
            <ul>
              {failed.map((cond, i) => (
                <li key={i} className="failed-cond">❌ {cond}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="result-actions">
        {status === 'Eligible' && scheme?.url && (
          <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Apply Now
          </a>
        )}

        {status === 'Not Eligible' && scheme?.category && (
          <Link to={`/browse?category=${scheme.category}`} className="btn btn-secondary">
            Browse Similar Schemes
          </Link>
        )}

        {scheme && (
          <button 
            className={`btn ${bookmarked ? 'btn-bookmarked' : 'btn-outline'}`}
            onClick={() => toggleBookmark(scheme)}
          >
            {bookmarked ? 'Remove Bookmark' : 'Bookmark Scheme'}
          </button>
        )}

        <button className="btn btn-outline" onClick={handleShare}>
          Share Scheme
        </button>
        
        <Link to="/browse" className="btn btn-text">
          Check Another Scheme
        </Link>
      </div>
    </div>
  );
};

export default EligibilityResult;
