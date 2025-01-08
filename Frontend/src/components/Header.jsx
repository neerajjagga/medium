import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import SearchBar from "./SearchBar";
import { Bell, Search, SquarePen } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ProfileModal from "./ProfileModal";

const Header = (props) => {
  const {
    handleClick,
    bgColor,
    borderColor,
    paddingX,
    paddingY,
    linksFontSize,
    container,
    marginX,
  } = props;

  const { authUser } = useAuthStore();

  const { pathname } = useLocation();

  const [showProfileModal, setShowProfileModal] = useState(false);

  const profileModalRef = useRef(null);
  const profileImgRef = useRef(null);

  const handleMouseDown = (e) => {
    if (
      profileImgRef.current &&
      profileModalRef.current &&
      !profileModalRef.current.contains(e.target) &&
      !profileImgRef.current.contains(e.target)
    ) {
      setShowProfileModal((prev) => !prev);
    }
  };

  return (
    <header
      className={`${
        bgColor && bgColor
      } w-full relative border-b-[1px] border-solid ${borderColor}`}
      style={{ zIndex: 5 }}
    >
      <div
        className={`w-full ${container} ${marginX} flex justify-between items-center ${paddingX} ${paddingY}`}
      >
        <div className="flex gap-4 items-center">
          <div className="text-3xl capitalize">
            <Link to="/">Medium</Link>
          </div>
          {authUser && <SearchBar />}
        </div>

        <ul className={`flex items-center gap-7 capitalize ${linksFontSize}`}>
          <li className="hidden sm:block">
            <Link
              to="/new-story"
              className={`flex gap-2 items-center ${
                pathname === "/new-story" ? "text-black" : "text-neutral-700"
              } hover:text-black`}
            >
              {authUser && (
                <SquarePen
                  className="size-5"
                  absoluteStrokeWidth={true}
                  size={32}
                />
              )}
              <span>Write</span>
            </Link>
          </li>
          <li className="block sm:hidden">
            <Link to="/explore-topics">
              <Search
                className="size-5 text-neutral-700 group-hover:text-black"
                absoluteStrokeWidth={true}
                size={32}
              />
            </Link>
          </li>
          {authUser && (
            <li>
              <Link
                to="/me/notifications"
                className="text-neutral-700 hover:text-black"
              >
                <Bell
                  className="size-5"
                  fill={pathname === "/me/notifications" ? "black" : "white"}
                  absoluteStrokeWidth={true}
                  size={32}
                />
              </Link>
            </li>
          )}
          {authUser && (
            <li
              className="cursor-pointer hover:shadow-sm"
              onClick={() => {
                setShowProfileModal((prev) => !prev);
              }}
              ref={profileImgRef}
            >
              <img
                className="size-8 object-cover rounded-full"
                src={authUser.profileImgUrl}
                alt={authUser.name}
              />
            </li>
          )}
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
      {showProfileModal && (
        <ProfileModal
          profileModalRef={profileModalRef}
          handleMouseDown={handleMouseDown}
        />
      )}
    </header>
  );
};

export default Header;
