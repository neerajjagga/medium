import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useBlogStore } from "../store/useBlogStore";
import { Link, useNavigate, useParams } from "react-router-dom";
import BlogDetailsSkeleton from "../components/Skeleton/BlogDetailsSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { useProfileStore } from "../store/useProfileStore";
import { formatMongoDate } from "../lib/utils";

const BlogDetailsPage = () => {
  const { username, titleSlug } = useParams();
  const { blog, isBlogFetched, getSingleBlog } = useBlogStore();
  const { authUser } = useAuthStore();
  const { unfollowUser, followUser } = useProfileStore();

  const navigate = useNavigate();

  const [isFollowing, setIsFollowing] = useState(null);

  useEffect(() => {
    getSingleBlog(username, titleSlug);
  }, []);

  useEffect(() => {
    if (blog) {
      console.log(blog);
      setIsFollowing(blog.creator.followers.includes(authUser._id));
    }
  }, [blog]);

  const handleClick = async () => {
    if (isFollowing) {
      await unfollowUser(blog.creator.username);
    } else {
      await followUser(blog.creator.username);
    }
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        bgColor="bg-white"
        borderColor="border-gray-200"
        paddingX="px-6"
        paddingY="py-2"
        linksFontSize="text-[0.9rem]"
      />
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {isBlogFetched ? (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2.5">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  {blog.title}
                </h1>

                {blog.subtitle && (
                  <p className="text-base text-stone-600 leading-6">
                    {blog.subtitle}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5 group cursor-pointer">
                  <img
                    src={
                      blog.creator?.profileImgUrl || "/assets/media/avatar.png"
                    }
                    alt={blog.creator?.name || "Author"}
                    className="object-cover w-10 h-10 rounded-full"
                  />
                  <p className="text-sm capitalize group-hover:underline">
                    {blog.creator?.name}
                  </p>
                </div>
                {blog.creator._id !== authUser._id && (
                  <button
                    className={`text-[0.775rem] px-3 py-1 border-solid border-[1px] border-green-700 rounded-3xl ${
                      isFollowing
                        ? "bg-white text-green-700 hover:bg-gray-200"
                        : "bg-green-700 text-white hover:bg-green-800"
                    }`}
                    onClick={handleClick}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
                <div className="flex items-center gap-2 text-[0.8rem] text-stone-600">
                  <span>{blog.readingTime} min read</span>
                  <span className="w-[2px] h-[2px] rounded-full bg-neutral-800"></span>
                  <span>{formatMongoDate(blog.publishAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-b px-1.5 py-3.5">
                <div className="flex items-center gap-8">
                  <button className="flex items-center gap-1 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill="#6B6B6B"
                        d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="text-sm text-stone-600 group-hover:text-black">
                      {blog.clapCount}
                    </span>
                  </button>
                  <button className="flex items-center gap-1 group">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="#6B6B6B"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fill="#6B6B6B"
                        d="M12.344 11.458A5.28 5.28 0 0 0 14 7.526C14 4.483 11.391 2 8.051 2S2 4.483 2 7.527c0 3.051 2.712 5.526 6.059 5.526a6.6 6.6 0 0 0 1.758-.236q.255.223.554.414c.784.51 1.626.768 2.512.768a.37.37 0 0 0 .355-.214.37.37 0 0 0-.03-.384 4.7 4.7 0 0 1-.857-1.958v.014z"
                      ></path>
                    </svg>
                    <span className="text-sm text-stone-600 group-hover:text-black">
                      {blog.postResponseCount}
                    </span>
                  </button>
                </div>
                <div>
                  <button className="text-stone-500 hover:text-neutral-800">
                    <i className="fa fa-bookmark-o" aria-hidden="true"></i>
                  </button>
                </div>
              </div>

              <div>
                <img
                  src={blog.thumbnailUrl}
                  alt="Thumbnail"
                  className="object-cover w-full rounded-md shadow h-72"
                />
              </div>

              <div
                className="default-browser-styles"
                dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
              ></div>

              {blog.tags?.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                  {blog.tags.map((tag, index) => (
                    <li
                      key={index}
                      className="px-3 py-1 text-sm text-neutral-800 bg-gray-200 rounded-full"
                    >
                      <span>#{tag}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex justify-between items-start gap-3">
                <div className="flex items-start gap-4 flex-grow-0 flex-[80%]">
                  <img
                    src={
                      blog.creator?.profileImgUrl || "/assets/media/avatar.png"
                    }
                    alt={blog.creator.name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <div className="flex flex-col gap-2.5">
                    <h2 className="text-xl font-semibold text-neutral-800">
                      {blog.creator.name}
                    </h2>
                    <div className="flex items-center gap-2 text-[0.8rem] text-stone-600">
                      <Link
                        to={`/${blog.creator.username}/followers`}
                        className="hover:underline"
                      >
                        {blog.creator.followersCount} Followers
                      </Link>
                      <span className="w-[2px] h-[2px] rounded-full bg-neutral-800"></span>
                      <Link
                        to={`/${blog.creator.username}/following`}
                        className="hover:underline"
                      >
                        {blog.creator.followingCount} Following
                      </Link>
                    </div>
                    <p className="text-[0.8rem]">{blog.creator.bio}</p>
                  </div>
                </div>
                {blog.creator._id === authUser._id ? (
                  <button
                    onClick={() => {
                      navigate(`/${authUser.username}`, {
                        state: { showUpdateProfileModal: true },
                      });
                    }}
                    className="text-[0.8rem] px-3.5 py-2 border-solid border-[1px] rounded-3xl bg-neutral-800 text-white transition-colors hover:bg-black"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <button
                    className={`text-[0.8rem] px-3.5 py-2 border-solid border-[1px] border-green-700 rounded-3xl ${
                      isFollowing
                        ? "bg-white text-green-700 hover:bg-gray-200"
                        : "bg-green-700 text-white hover:bg-green-800"
                    }`}
                    onClick={handleClick}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <BlogDetailsSkeleton />
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogDetailsPage;
