import React from 'react';
import './FilterBar.css';

const FilterBar = ({ categories = [], activeCategory = 'All', onCategoryChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-chips">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
