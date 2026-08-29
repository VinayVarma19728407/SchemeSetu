import React, { createContext, useState } from 'react';

export const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('name');

  const setCategoryFilter = (cat) => {
    setCategory(cat);
    setPage(1); // Reset page on category change
  };

  const setSearchFilter = (query) => {
    setSearch(query);
    setPage(1); // Reset page on search
  };

  const clearFilters = () => {
    setCategory('All');
    setSearch('');
    setPage(1);
    setSort('name');
  };

  return (
    <FilterContext.Provider value={{
      category,
      setCategory: setCategoryFilter,
      search,
      setSearch: setSearchFilter,
      page,
      setPage,
      sort,
      setSort,
      clearFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterContext;
