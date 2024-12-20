import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import SearchBar from "./SearchBar";
import { SquarePen } from "lucide-react";

const Header = (props) => {
  const {
    handleClick,
    bgColor,
    borderColor,
    paddingX,
    paddingY,
    linksFontSize,
  } = props;

  const { authUser } = useAuthStore();

  return (
    <header
      className={`${bgColor} w-full sticky top-0 border-b-[1px] border-solid ${borderColor}`}
      style={{ zIndex: 5 }}
    >
      <div
        className={`w-full md:container md:mx-auto flex justify-between items-center ${paddingX} ${paddingY}`}
      >
        <div className="flex gap-4 items-center">
          <div className="text-3xl capitalize">
            <a href="/">Medium</a>
          </div>
          {authUser && <SearchBar />}
        </div>

        <ul className={`flex items-center gap-7 capitalize ${linksFontSize}`}>
          <li className="hidden sm:flex sm:gap-2 sm:items-center">
            <SquarePen className="size-6" absoluteStrokeWidth={true} size={64} />
            <a href="/write">Write</a>
          </li>
          {!authUser && (
            <li>
              <button onClick={handleClick}>Sign in</button>
            </li>
          )}
          {!authUser && (
            <li>
              <button
                className="px-5 py-2.5 bg-neutral-800 rounded-3xl text-white hover:bg-black"
                onClick={handleClick}
              >
                Get started
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
