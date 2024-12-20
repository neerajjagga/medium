import { Search } from "lucide-react";
import React, { useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  return (
    <div className="relative">
      <Search
        className="size-6 absolute left-2 top-[50%] -translate-y-[50%]"
        absoluteStrokeWidth={true}
        size={64}
      />
      <input
        type="text"
        placeholder="Search"
        className="ps-10 pe-4 py-2 outline-none bg-[#efefef] rounded-3xl"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
