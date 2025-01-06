import { Search } from "lucide-react";
import React, { useState } from "react";
import SearchResultModal from "./SearchResultModal";

const SearchBar = () => {
  const [search, setSearch] = useState("");

  const [showSearchResultModal, setShowSearchResultModal] = useState(false);
  const [hoverInsideResultModal, setHoverInsideResultModal] = useState(false);

  const handleFocus = (e) => {
    setShowSearchResultModal(true);
  };

  const handleBlur = (e) => {
    if (!hoverInsideResultModal) {
      setShowSearchResultModal(false);
    }
  };

  const handleMouseEnter = (e) => {
    setHoverInsideResultModal(true);
  }

  const handleMouseLeave = (e) => {
     setHoverInsideResultModal(false);
  }

  return (
    <div className="hidden relative sm:block">
      <input
        type="text"
        placeholder="Search"
        className="search-input ps-10 pe-4 py-2 outline-none bg-[#f7f7f7] rounded-3xl placeholder:text-[0.95rem]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      <Search
        className="text-neutral-400 search-icon size-5 absolute left-2 top-[50%] -translate-y-[50%]"
        absoluteStrokeWidth={true}
        size={40}
      />
      {showSearchResultModal && <SearchResultModal handleMouseEnter={handleMouseEnter} handleMouseLeave={handleMouseLeave} />}
    </div>
  );
};

export default SearchBar;
