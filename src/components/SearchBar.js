import React from "react";
import RegularIcon from "./icons/RegularIcon";

function SearchBar({ setQuery }) {
  return (
    <div className="flex justify-end items-center w-full">
      <label className="expandSearch">
        <RegularIcon name="search" className="text-center" />

        <input
          type="text"
          placeholder="Search..."
          id="searchQuery"
          name="search"
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>
    </div>
  );
}

export default SearchBar;
