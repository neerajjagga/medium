import React, { useEffect } from "react";
import Header from "../components/Header";
import { useBlogStore } from "../store/useBlogStore";
import { useParams } from "react-router-dom";
import BlogDetailsSkeleton from "../components/Skeleton/BlogDetailsSkeleton";

const BlogDetailsPage = () => {
  const { username, titleSlug } = useParams();
  const { blog, isBlogFetched, getSingleBlog } = useBlogStore();

  useEffect(() => {
    getSingleBlog(username, titleSlug);
  }, []);

  useEffect(() => {
    console.log(blog);
  }, [blog]);

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
        {isBlogFetched ? (
          <div className="max-w-4xl px-6 py-8 mx-auto">
            {/* Title */}
            <h1 className="mb-2 text-3xl font-bold leading-tight text-gray-900">{blog.title}</h1>

            {/* Subtitle */}
            {blog.subtitle && (
              <p className="mb-4 text-lg text-gray-600">{blog.subtitle}</p>
            )}

            {/* Author Info */}
            <div className="flex items-center gap-3 mb-8">
              <img
                src={blog.creator?.profileImgUrl || "/assets/media/avatar.png"}
                alt={blog.creator?.name || "Author"}
                className="object-cover w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-semibold">{blog.creator?.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(blog.publishAt).toLocaleDateString()} · {blog.readingTime} min read
                </p>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="mb-8">
              <img
                src={blog.thumbnailUrl}
                alt="Thumbnail"
                className="object-cover w-full rounded-md shadow h-72"
              />
            </div>

            {/* Content */}
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.htmlContent }}
            ></div>

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-10">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        ) : (
          <BlogDetailsSkeleton />
        )}
      </main>
    </div>
  );
};

export default BlogDetailsPage;
