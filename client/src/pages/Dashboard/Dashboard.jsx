import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaBookmark, FaSearch, FaShieldAlt, FaUser } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext.jsx';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import SchemeCard from '../../components/common/SchemeCard.jsx';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);

  const profileFields = ['age', 'gender', 'occupation', 'income', 'state', 'category'];
  const filled = user ? profileFields.filter(f => user[f]).length : 0;
  const profilePercent = Math.round((filled / profileFields.length) * 100);

  return (
    <div className="dashboard-page container">
      <h1 className="dash-welcome">Welcome back, {user?.name || 'User'}!</h1>
      <div className="dash-stats">
        <div className="stat-card">
          <FaBookmark className="stat-icon" />
          <div><span className="stat-num">{bookmarks.length}</span><span className="stat-label">Bookmarks</span></div>
        </div>
        <div className="stat-card">
          <FaUser className="stat-icon" />
          <div><span className="stat-num">{profilePercent}%</span><span className="stat-label">Profile Complete</span></div>
        </div>
      </div>

      <section className="dash-section">
        <div className="section-header">
          <h2 className="section-title">Your Bookmarked Schemes</h2>
          {bookmarks.length > 4 && <Link to="/bookmarks" className="section-link">View All</Link>}
        </div>
        {bookmarks.length === 0 ? (
          <div className="dash-empty"><p>No bookmarks yet. Start exploring!</p><Link to="/browse" className="btn btn-primary">Browse Schemes</Link></div>
        ) : (
          <div className="scheme-grid">{bookmarks.slice(0, 4).map(s => <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={true} />)}</div>
        )}
      </section>

      <section className="dash-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/browse" className="action-card"><FaSearch /><span>Browse Schemes</span></Link>
          <Link to="/find-schemes" className="action-card"><FaShieldAlt /><span>Find Schemes for Me</span></Link>
          <Link to="/profile" className="action-card"><FaUser /><span>My Profile</span></Link>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
