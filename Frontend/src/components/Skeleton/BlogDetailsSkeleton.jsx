import React from "react";

const BlogDetailsSkeleton = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-2">
        <div className="skeleton h-5 rounded-none"></div>
        <div className="skeleton h-5 w-11/12 rounded-none"></div>
      </div>
      <div className="flex items-center gap-3">
        <div className="skeleton w-8 h-8 rounded-full"></div>
        <div className="skeleton w-24 h-3 rounded-none"></div>
        <div className="skeleton w-16 h-8"></div>
        <div className="skeleton w-32 h-3 rounded-none"></div>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="skeleton w-6 h-6 rounded-full"></div>
          <div className="skeleton w-6 h-6"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="skeleton w-32 h-3 rounded-none"></div>
        </div>
      </div>
      <div className="skeleton h-64 rounded-none"></div>
      <div className="flex flex-col gap-2.5">
        <div className="skeleton h-4 rounded-none"></div>
        <div className="skeleton h-4 w-11/12 rounded-none"></div>
        <div className="skeleton h-4 w-10/12 rounded-none"></div>
        <div className="skeleton h-4 rounded-none"></div>
      </div>
    </div>
  );
};

export default BlogDetailsSkeleton;
