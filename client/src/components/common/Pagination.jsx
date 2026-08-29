import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <nav className="pagination" aria-label="Page navigation">
      <button className="page-btn prev" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
        <FaChevronLeft /> <span>Previous</span>
      </button>
      <div className="page-numbers">
        {getPages().map((p, i) =>
          p === '...' ? (
            <span key={`e${i}`} className="page-ellipsis">…</span>
          ) : (
            <button key={p} className={`page-num ${p === currentPage ? 'active' : ''}`} onClick={() => onPageChange(p)}>{p}</button>
          )
        )}
      </div>
      <button className="page-btn next" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <span>Next</span> <FaChevronRight />
      </button>
    </nav>
  );
};

export default Pagination;
