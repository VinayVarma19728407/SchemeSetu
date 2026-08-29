import React from 'react';
import './SkeletonLoader.css';

const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-badge shimmer" />
    <div className="skeleton-title shimmer" />
    <div className="skeleton-line shimmer" />
    <div className="skeleton-line short shimmer" />
    <div className="skeleton-ministry shimmer" />
    <div className="skeleton-link shimmer" />
  </div>
);

const SkeletonDetail = () => (
  <div className="skeleton-detail">
    <div className="skeleton-detail-badge shimmer" />
    <div className="skeleton-detail-title shimmer" />
    <div className="skeleton-detail-block shimmer" />
    <div className="skeleton-detail-block shimmer" />
    <div className="skeleton-detail-block short shimmer" />
  </div>
);

const SkeletonList = () => (
  <div className="skeleton-list-item">
    <div className="skeleton-list-line shimmer" />
    <div className="skeleton-list-line short shimmer" />
  </div>
);

const SkeletonLoader = ({ type = 'card', count = 8 }) => {
  const items = Array.from({ length: count });

  if (type === 'detail') return <SkeletonDetail />;

  return (
    <div className={`skeleton-grid ${type === 'list' ? 'skeleton-grid-list' : ''}`}>
      {items.map((_, i) => (
        type === 'list' ? <SkeletonList key={i} /> : <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default SkeletonLoader;
