import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import SchemeCard from '../../components/common/SchemeCard.jsx';
import SkeletonLoader from '../../components/common/SkeletonLoader.jsx';
import { getCategoryColor } from '../../utils/helpers.js';
import './FindSchemes.css';

const FindSchemes = () => {
  const { user } = useContext(AuthContext);
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    // Build a query based on profile fields
    const params = new URLSearchParams();
    if (user.occupation) params.append('occupation', user.occupation);
    if (user.gender) params.append('gender', user.gender);
    if (user.income) params.append('income', user.income);
    if (user.state) params.append('state', user.state);
    if (user.category) params.append('category', user.category);
    // Assume backend endpoint for personalized suggestions
    fetch(`/api/schemes/personalized?${params}`)
      .then(r => r.json())
      .then(d => setRecommended(d.data?.schemes || []))
      .catch(() => setRecommended([]))
      .finally(() => setLoading(false));
  }, [user]);

  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  if (loading) return <div className="container"><SkeletonLoader type="card" count={6} /></div>;

  return (
    <div className="find-schemes-page container">
      <h1 className="page-title">Schemes Curated for You</h1>
      {recommended.length === 0 ? (
        <div className="no-results">
          <p>No schemes match your profile at the moment. Try updating your profile or explore all schemes.</p>
        </div>
      ) : (
        <div className="scheme-grid">{recommended.map(s => <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={isBookmarked(s.id)} />)}</div>
      )}
    </div>
  );
};

export default FindSchemes;
