import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaSortAlphaDown, FaClock } from 'react-icons/fa';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import SchemeCard from '../../components/common/SchemeCard.jsx';
import './Bookmarks.css';

const Bookmarks = () => {
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name');

  const filtered = bookmarks
    .filter(s => s.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : new Date(b.metadata?.createdAt || 0) - new Date(a.metadata?.createdAt || 0));

  return (
    <div className="bookmarks-page container">
      <h1 className="page-title">My Bookmarks</h1>
      <div className="bookmarks-toolbar">
        <div className="bookmarks-search">
          <FaSearch className="bm-search-icon" />
          <input type="text" placeholder="Filter bookmarks..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="bookmarks-sort">
          <button className={`sort-btn ${sort === 'name' ? 'active' : ''}`} onClick={() => setSort('name')}><FaSortAlphaDown /> Name</button>
          <button className={`sort-btn ${sort === 'recent' ? 'active' : ''}`} onClick={() => setSort('recent')}><FaClock /> Recent</button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="bookmarks-empty">
          <h3>{bookmarks.length === 0 ? "You haven't bookmarked any schemes yet." : 'No bookmarks match your filter.'}</h3>
          <Link to="/browse" className="btn btn-primary">Browse Schemes</Link>
        </div>
      ) : (
        <div className="scheme-grid">{filtered.map(s => <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={true} />)}</div>
      )}
    </div>
  );
};

export default Bookmarks;
