import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import SearchBar from "./SearchBar";
import { Bell, SquarePen } from "lucide-react";
import { Link } from "react-router-dom";
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

  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <header
      className={`${bgColor} w-full sticky top-0 border-b-[1px] border-solid ${borderColor}`}
      style={{ zIndex: 5 }}
    >
      <div
        className={`relative w-full ${container} ${marginX} flex justify-between items-center ${paddingX} ${paddingY}`}
      >
        <div className="flex gap-4 items-center">
          <div className="text-3xl capitalize">
            <Link to="/">Medium</Link>
          </div>
          {authUser && (
            <SearchBar />
          )}
        </div>

        <ul className={`flex items-center gap-7 capitalize ${linksFontSize}`}>
          <li className="hidden sm:block">
            <Link to="/new-story" className="group flex gap-2 items-center">
              {authUser && (
                <SquarePen
                  className="size-5 text-neutral-800 group-hover:text-black"
                  absoluteStrokeWidth={true}
                  size={40}
                />
              )}
              <span className="text-neutral-800 group-hover:text-black">
                Write
              </span>
            </Link>
          </li>
          {authUser && (
            <li>
              <Link to="/me/notifications" className="group">
                <Bell
                  className="size-5 text-neutral-800 group-hover:text-black"
                  absoluteStrokeWidth={true}
                  size={40}
                />
              </Link>
            </li>
          )}
          {authUser && (
            <li
              className="rounded-full cursor-pointer hover:shadow-sm"
              onClick={() => setShowProfileModal((prev) => !prev)}
            >
              <img
                className="size-8 object-cover"
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

        {showProfileModal && <ProfileModal />}
      </div>
    </header>
  );
};

export default Header;
