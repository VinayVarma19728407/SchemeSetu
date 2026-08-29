import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaRegBookmark, FaArrowRight } from 'react-icons/fa';
import { truncateText, getCategoryColor, getMinistryShortName } from '../../utils/helpers.js';
import './SchemeCard.css';

const SchemeCard = ({ scheme, onBookmark, isBookmarked }) => {
  const ministryName = getMinistryShortName(scheme.ministry);
  const catColor = getCategoryColor(scheme.category);

  return (
    <div className="scheme-card card card-hover">
      <div className="scheme-card-header">
        <span className="scheme-category-badge" style={{ backgroundColor: catColor }}>{scheme.category}</span>
        <button className={`bookmark-toggle ${isBookmarked ? 'bookmarked' : ''}`} onClick={(e) => { e.preventDefault(); onBookmark && onBookmark(scheme.id); }} aria-label="Bookmark">
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
      </div>
      <h3 className="scheme-card-title">{scheme.name}</h3>
      <p className="scheme-card-desc">{truncateText(scheme.overview, 120)}</p>
      <p className="scheme-card-ministry">{ministryName}</p>
      <Link to={`/scheme/${scheme.slug}`} className="scheme-card-link">
        Know More <FaArrowRight className="link-icon" />
      </Link>
    </div>
  );
};

export default SchemeCard;
