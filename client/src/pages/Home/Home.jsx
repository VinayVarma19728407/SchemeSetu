import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaSearch, FaShieldAlt } from 'react-icons/fa';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import SchemeCard from '../../components/common/SchemeCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import SkeletonLoader from '../../components/common/SkeletonLoader.jsx';
import { CATEGORIES } from '../../utils/constants.js';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    axios.get('/api/schemes/featured').then(r => setFeatured(r.data.data || [])).catch(() => {}).finally(() => setLoadingFeatured(false));
    axios.get('/api/schemes/recent').then(r => setRecent(r.data.data || [])).catch(() => {}).finally(() => setLoadingRecent(false));
  }, []);

  const handleSearch = (q) => { if (q.trim()) navigate(`/browse?search=${encodeURIComponent(q.trim())}`); };
  const handleCategory = (cat) => { navigate(cat === 'All' ? '/browse' : `/browse?category=${encodeURIComponent(cat)}`); };
  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-tricolor" />
        <div className="container hero-content">
          <h1 className="hero-title">Discover Government Schemes You May Be Eligible For</h1>
          <p className="hero-subtitle">Explore 150+ central government schemes across 17 categories. Find benefits tailored to your profile.</p>
          <div className="hero-cta">
            <Link to="/browse" className="btn btn-primary btn-lg">Browse Schemes <FaArrowRight /></Link>
            <Link to="/find-schemes" className="btn btn-outline btn-lg">Find Schemes for Me <FaShieldAlt /></Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="home-search container">
        <SearchBar value={search} onChange={setSearch} onSearch={handleSearch} placeholder="Search by Scheme Name, Ministry or Keyword..." />
      </section>

      {/* Categories */}
      <section className="home-categories container">
        <h2 className="section-title">Browse by Category</h2>
        <FilterBar categories={CATEGORIES} activeCategory="" onCategoryChange={handleCategory} />
      </section>

      {/* Featured */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Featured Schemes</h2>
          <Link to="/browse" className="section-link">View All <FaArrowRight /></Link>
        </div>
        {loadingFeatured ? <SkeletonLoader type="card" count={6} /> : (
          <div className="scheme-grid">
            {featured.slice(0, 6).map(s => (
              <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={isBookmarked(s.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Recent */}
      <section className="home-section container">
        <div className="section-header">
          <h2 className="section-title">Recently Added</h2>
          <Link to="/browse" className="section-link">View All <FaArrowRight /></Link>
        </div>
        {loadingRecent ? <SkeletonLoader type="card" count={6} /> : (
          <div className="scheme-grid">
            {recent.slice(0, 6).map(s => (
              <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={isBookmarked(s.id)} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
