import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { BookmarkContext } from '../../context/BookmarkContext.jsx';
import SchemeCard from '../../components/common/SchemeCard.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import FilterBar from '../../components/common/FilterBar.jsx';
import SkeletonLoader from '../../components/common/SkeletonLoader.jsx';
import Pagination from '../../components/common/Pagination.jsx';
import { CATEGORIES, PER_PAGE } from '../../utils/constants.js';
import { debounce } from '../../utils/helpers.js';
import './BrowseSchemes.css';

const BrowseSchemes = () => {
  const [params, setParams] = useSearchParams();
  const { bookmarks, toggleBookmark } = useContext(BookmarkContext);

  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(Number(params.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState(params.get('search') || '');
  const [category, setCategory] = useState(params.get('category') || 'All');

  const fetchSchemes = useCallback(async (p, cat, q) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: p, limit: PER_PAGE });
      if (cat && cat !== 'All') query.set('category', cat);
      if (q) query.set('search', q);
      const res = await axios.get(`/api/schemes?${query}`);
      const d = res.data.data || {};
      setSchemes(d.schemes || []);
      setTotalPages(d.totalPages || 1);
      setTotalCount(d.total || 0);
    } catch { setSchemes([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSchemes(page, category, search); }, [page, category]);

  const debouncedSearch = useCallback(debounce((q) => {
    setPage(1);
    fetchSchemes(1, category, q);
    updateParams(1, category, q);
  }, 400), [category]);

  const handleSearch = (q) => { debouncedSearch(q); };
  const handleSearchChange = (v) => { setSearch(v); debouncedSearch(v); };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearch('');
    updateParams(1, cat, '');
  };

  const handlePageChange = (p) => {
    setPage(p);
    updateParams(p, category, search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateParams = (p, cat, q) => {
    const np = new URLSearchParams();
    if (p > 1) np.set('page', p);
    if (cat && cat !== 'All') np.set('category', cat);
    if (q) np.set('search', q);
    setParams(np);
  };

  const clearFilters = () => { setSearch(''); setCategory('All'); setPage(1); setParams({}); fetchSchemes(1, 'All', ''); };
  const isBookmarked = (id) => bookmarks.some(b => b.id === id);

  return (
    <div className="browse-page container">
      <h1 className="browse-title">Browse Government Schemes</h1>
      <SearchBar value={search} onChange={handleSearchChange} onSearch={handleSearch} placeholder="Search by name, keyword or ministry..." />
      <FilterBar categories={CATEGORIES} activeCategory={category} onCategoryChange={handleCategoryChange} />

      <div className="browse-results-info">
        {search ? <p>Showing <strong>{totalCount}</strong> results for "<em>{search}</em>"</p> : <p>Showing <strong>{totalCount}</strong> schemes</p>}
      </div>

      {loading ? <SkeletonLoader type="card" count={8} /> : schemes.length === 0 ? (
        <div className="browse-empty">
          <h3>No matching schemes found.</h3>
          <p>Try a different search term or category.</p>
          <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
        </div>
      ) : (
        <>
          <div className="scheme-grid">{schemes.map(s => <SchemeCard key={s.id} scheme={s} onBookmark={toggleBookmark} isBookmarked={isBookmarked(s.id)} />)}</div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
};

export default BrowseSchemes;
