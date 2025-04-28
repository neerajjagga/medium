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
        {0 ? (
          <div>
            <h1>{blog.title}</h1>
          </div>
        ) : (
          <BlogDetailsSkeleton />
        )}
      </main>
    </div>
  );
};

export default BlogDetailsPage;
