import React from "react";

const ProfileSidebarSkeleton = () => {
  return (
    <div className="w-52 flex flex-col gap-8 custom-md:flex-row custom-md:justify-between custom-md:w-full">
      <div className="flex flex-col gap-6 custom-md:flex-row custom-md:gap-4">
        <div className="skeleton size-[6rem] shrink-0 rounded-full custom-md:size-[3.5rem] "></div>
        <div className="flex flex-col gap-4">
          <div className="skeleton h-4 w-28 custom-md:h-7"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
        <div className="skeleton h-20 w-full custom-md:hidden"></div>
        <div className="flex gap-2 custom-md:hidden">
          <div className="skeleton w-16 h-8 rounded-3xl"></div>
          <div className="skeleton p-4 rounded-full"></div>
        </div>
      </div>

      <div className="hidden skeleton w-[6rem] h-9 rounded-3xl custom-md:block"></div>

      <div className="flex flex-col gap-6 custom-md:hidden">
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
