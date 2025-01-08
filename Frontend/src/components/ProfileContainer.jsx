import { Ellipsis, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useProfileStore } from "../store/useProfileStore";
import BlogCard from "./BlogCard";
import { debounce, formatFollowers, formatMongoDate } from "../lib/utils";
import { Link } from "react-router-dom";

const ProfileContainer = ({ profileData }) => {
  const [activeTag, setActiveTag] = useState("home");

  const {
    blogs,
    message,
    isGettingBlogs,
    allBlogsFetched,
    getUserBlogs,
    setBlogs,
    setAllBlogsFetched,
  } = useProfileStore();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBlogs(profileData.blogs);
    window.scrollTo({ top: 0 });
    window.addEventListener("scroll", debounce(handlePageScroll, 75));
    return () => {
      setBlogs([]);
      setAllBlogsFetched(false);
      window.removeEventListener("scroll", debounce(handlePageScroll, 75));
    };
  }, []);

  useEffect(() => {
    if (loading === true) {
      getUserBlogs(profileData._id, page);
    }
    return () => setLoading(false);
  }, [page]);

  useEffect(() => {
    if (loading === true && !allBlogsFetched) {
      setPage((prevValue) => prevValue + 1);
    }
  }, [loading]);

  const handlePageScroll = (e) => {
    if (
      document.body.scrollHeight - 537 <
      window.scrollY + window.innerHeight
    ) {
      if (loading === false) {
        setLoading(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center gap-4 custom-md:hidden">
        <h1 className="text-4xl font-semibold tracking-tight">
          {profileData.name}
        </h1>
        <button className="px-[0.35rem] py-[0.4rem] rounded-md text-stone-500 hover:text-neutral-800 hover:bg-gray-100">
          <Ellipsis className="size-5" />
        </button>
      </div>
      <ul className="flex gap-7 items-center border-solid border-b-[1px] border-gray-200">
        {["home", "about"].map((tag, index) => {
          return (
            <li
              className={`pb-3.5 border-solid border-b-[1px] ${
                tag === activeTag && "border-black"
              }`}
              key={index}
            >
              <button
                className={`text-[0.8rem] ${
                  tag === activeTag ? "text-black" : "text-neutral-600"
                } capitalize hover:text-black`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            </li>
          );
        })}
      </ul>
      {isGettingBlogs && (
        <div className="flex justify-center items-center mt-16">
          <Loader2 className="size-8 animate-spin" />
        </div>
      )}
      {activeTag === "home" && (
        <ul className="flex flex-col gap-3">
          {blogs.map((blog, index) => {
            return (
              <BlogCard
                key={index}
                cardData={blog}
                username={profileData.username}
              />
            );
          })}
          {(message || blogs.length === 0) && (
            <h3 className="mt-4 text-base text-neutral-800 font-semibold">
              {message ? message : "No blog is created yet!"}
            </h3>
          )}
        </ul>
      )}
      {activeTag === "about" && (
        <div className="flex flex-col gap-6">
          <h4 className="text-[0.85rem] text-neutral-600 tracking-tight font-medium">
            Member Since {formatMongoDate(profileData.createdAt)}
          </h4>
          {profileData.bio && (
            <p className="text-[0.8rem] text-neutral-600">{profileData.bio}</p>
          )}
          <div className="flex gap-6">
            <Link
              to={`/${profileData.username}/followers`}
              className="text-[0.85rem] text-green-600 capitalize font-medium tracking-tight hover:text-green-800"
            >
              {formatFollowers(profileData.followersCount)} Followers
            </Link>
            <Link
              to={`/${profileData.username}/following`}
              className="text-[0.85rem] text-green-600 capitalize font-medium tracking-tight hover:text-green-800"
            >
              {formatFollowers(profileData.followingCount)} Following
            </Link>
          </div>
          <div className="h-[1px] bg-black w-full mt-8"></div>
        </div>
      )}
    </div>
  );
};

export default ProfileContainer;
