import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User, SquarePen } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";

const ProfileModal = ({ handleMouseDown, profileModalRef }) => {
  const { authUser, logout } = useAuthStore();

  const { username } = useParams();

  const { pathname } = useLocation();

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.addEventListener("mousedown", handleMouseDown);
    };
  }, []);

  const handleClick = () => {
    logout();
  };

  return (
    <div
      className="w-64 absolute right-0 -bottom-[13rem] shadow-box bg-white flex flex-col rounded-sm sm:-bottom-[9rem]"
      style={{ zIndex: 10 }}
      ref={profileModalRef}
    >
      <ul className="flex flex-col gap-4 p-5 border-solid border-b-[1px] border-gray-100 sm:hidden">
        <li>
          <Link
            to="/new-story"
            className={`flex gap-3 items-center ${
              pathname === "/new-story" ? "text-black" : "text-neutral-600"
            } hover:text-black`}
          >
            <SquarePen
              className="size-5"
              absoluteStrokeWidth={true}
              size={32}
            />
            <span className="text-[0.9rem]">Write</span>
          </Link>
        </li>
      </ul>

      <ul className="flex flex-col gap-4 p-5 border-solid border-b-[1px] border-gray-100">
        <li>
          <Link
            to={`/${authUser.username}`}
            className={`flex gap-3 items-center ${
              username === authUser.username ? "text-black" : "text-neutral-600"
            } hover:text-black`}
          >
            <User className="size-5" absoluteStrokeWidth={true} size={32} />
            <span className="text-[0.9rem]">Profile</span>
          </Link>
        </li>
      </ul>

      <ul className="flex flex-col gap-4 p-5 border-solid border-b-[1px] border-gray-200">
        <li className="ml-1">
          <button
            className="w-full flex flex-col gap-1 text-neutral-600 hover:text-black"
            onClick={handleClick}
          >
            <span className="text-[0.9rem]">Sign out</span>
            <span className="text-[0.8rem] text-neutral-700">
              {authUser.obfuscatedEmailId}
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ProfileModal;
