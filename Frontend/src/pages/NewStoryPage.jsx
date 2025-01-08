import React, { useRef, useState } from "react";
import ProfileModal from "../components/ProfileModal";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import { Bell } from "lucide-react";

const NewStoryPage = () => {

  const { pathname } = useLocation();
  const { authUser } = useAuthStore();
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
    <div className="flex flex-col min-h-screen">
      <header
        className="bg-white w-full relative"
        style={{ zIndex: 5 }}
      >
        <div className="max-w-[1072px] mx-auto w-full flex justify-between items-center px-6 py-2">
          <div className="text-3xl capitalize">
            <Link to="/">Medium</Link>
          </div>

          <ul className="flex items-center gap-7 capitalize">
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
      <div>New Story Page!</div>
    </div>
  );
};

export default NewStoryPage;
