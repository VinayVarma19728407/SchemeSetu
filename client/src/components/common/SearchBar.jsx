import React from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';

const SearchBar = ({ value, onChange, onSearch, placeholder = 'Search schemes...' }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') onSearch && onSearch(value);
  };

  return (
    <div className="search-bar">
      <FaSearch className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      {value && (
        <button className="search-clear" onClick={() => { onChange(''); onSearch && onSearch(''); }} aria-label="Clear search">
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
