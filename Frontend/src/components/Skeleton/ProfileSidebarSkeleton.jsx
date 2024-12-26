import React from "react";

const ProfileSidebarSkeleton = () => {
  return (
    <div className="w-52 flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <div className="skeleton size-[6rem] shrink-0 rounded-full"></div>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
        <div className="skeleton h-20 w-full"></div>
        <div className="flex gap-2">
          <div className="skeleton w-16 h-8 rounded-3xl"></div>
          <div className="skeleton p-4 rounded-full"></div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="skeleton h-4 w-20"></div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 items-center">
            <div className="skeleton h-6 w-6 shrink-0 rounded-full"></div>
            <div className="skeleton h-3 w-full"></div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="skeleton h-6 w-6 shrink-0 rounded-full"></div>
            <div className="skeleton h-3 w-full"></div>
          </div>
          <div className="flex gap-2 items-center">
            <div className="skeleton h-6 w-6 shrink-0 rounded-full"></div>
            <div className="skeleton h-3 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebarSkeleton;
