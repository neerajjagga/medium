import { MoveUpRight, Send } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const SearchResultModal = ({ handleMouseEnter, handleMouseLeave }) => {
  return (
    <div
      className="w-[20rem] absolute z-5 left-0 -bottom-[4.3rem] shadow-box bg-white"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="p-5">
        <Link to="/explore-topics">
          <div className="flex justify-between items-center gap-5 cursor-pointer">
            <div className="flex items-center gap-3">
              <Send className="size-5" />
              <span className="text-nowrap text-[0.9rem]">Explore topics</span>
            </div>
            <div>
              <MoveUpRight className="size-5 text-neutral-600" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SearchResultModal;
