import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { User } from "lucide-react";

const ProfileModal = ({
  handleMouseDown,
  profileModalRef
}) => {
  const { authUser, logout } = useAuthStore();

  useEffect(() => {
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.addEventListener("mousedown", handleMouseDown);
    }
  }, []);

  const handleClick = () => {
    logout();
  };

  return (
    <div
      className="w-64 absolute right-0 -bottom-[9rem] shadow-box bg-white flex flex-col rounded-sm"
      style={{ zIndex: 10 }}
      ref={profileModalRef}
    >
      <ul className="flex flex-col gap-4 p-5 border-solid border-b-[1px] border-gray-100">
        <li>
          <a
            href={`/${authUser.username}`}
            className="flex gap-3.5 items-center text-neutral-600 hover:text-black"
          >
            <User className="size-6" absoluteStrokeWidth={true} size={64} />
            <span className="text-[0.9rem]">Profile</span>
          </a>
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
