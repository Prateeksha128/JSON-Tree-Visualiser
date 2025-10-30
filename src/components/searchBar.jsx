import React from "react";
import "../assets/css/searchBar.css";

export default function SearchBar({ searchQuery, setSearchQuery }) {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="$.user.address.city"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
