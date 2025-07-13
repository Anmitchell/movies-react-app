import React from 'react';

interface SearchProps {
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
}

const Search = ({ searchTerm, setSearchTerm }: SearchProps) => {
  return (
    <div className='search'>
      <div className='text-white text-3xl'>
        <img src="/search.svg" alt="Search" />

        <input
          type="text"
          placeholder='Search through thousands of movies'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Search;