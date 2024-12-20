import { Search } from "lucide-react";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search"
        className="search-input ps-10 pe-4 py-2 outline-none bg-[#f7f7f7] rounded-3xl"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Search
        className="text-neutral-400 search-icon size-6 absolute left-2 top-[50%] -translate-y-[50%]"
        absoluteStrokeWidth={true}
        size={40}
      />
    </div>
  );
};

export default SearchBar;
