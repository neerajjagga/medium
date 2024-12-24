import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useFeedStore } from "../store/useFeedStore";
import BlogCard from "./BlogCard";

const FeedContainer = () => {
  const [activeTopic, setActiveTopic] = useState("for you");

  const { authUser } = useAuthStore();

  const [showLeftScrollButton, setShowLeftScrollButton] = useState(false);
  const [showRightScrollButton, setShowRightScrollButton] = useState(true);

  const ulRef = useRef(null);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const {
    isGettingFeeds,
    message,
    allBlogsFetched,
    setIsAllBlogsFetched,
    blogs,
    setBlogs,
    getForYouFeeds,
    getTopicRelatedFeeds,
  } = useFeedStore();

  useEffect(() => {
    getForYouFeeds();
  }, []);

  useEffect(() => {
    if (loading === true) {
      if (activeTopic === "for you") {
        getForYouFeeds(page);
      } else if (activeTopic === "following") {
        getTopicRelatedFeeds("following", activeTopic, page);
      } else {
        getTopicRelatedFeeds("tag", activeTopic, page);
      }
      return setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (loading === true && !allBlogsFetched) {
      setPage((prevValue) => prevValue + 1);
    }
  }, [loading]);

  const handleScroll = (e) => {
    if (!ulRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = ulRef.current;

    if (scrollLeft > 0) {
      if (showLeftScrollButton === false) {
        setShowLeftScrollButton(true);
      }
    } else {
      if (showLeftScrollButton === true) {
        setShowLeftScrollButton(false);
      }
    }

    if (scrollLeft + clientWidth == scrollWidth) {
      if (showRightScrollButton === true) {
        setShowRightScrollButton(false);
      }
    } else {
      if (showRightScrollButton === false) {
        setShowRightScrollButton(true);
      }
    }
  };

  const scrollLeft = (e) => {
    if (ulRef.current) {
      ulRef.current.scrollBy({ left: -100, behavior: "smooth" });
    }
  };

  const scrollRight = (e) => {
    if (ulRef.current) {
      ulRef.current.scrollBy({ left: 100, behavior: "smooth" });
    }
  };

  const handleClick = (topic) => {
    setActiveTopic(topic);
    setPage(1);
    setBlogs([]);
    setIsAllBlogsFetched(false)

    if (topic === "following") {
      getTopicRelatedFeeds("following", topic, page);
    } else if (topic == "for you") {
      getForYouFeeds(page);
    } else {
      getTopicRelatedFeeds("tag", topic, page);
    }
  };

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

  window.addEventListener("scroll", handlePageScroll);

  console.log(page, loading, allBlogsFetched);

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 items-center border-solid border-b-[1px] border-grey-200">
        {showLeftScrollButton && (
          <div className="pb-[0.6rem] pt-1">
            <button className="text-neutral-600 hover:text-black">
              <ChevronLeft
                className="size-5"
                absoluteStrokeWidth={true}
                size={40}
                onClick={scrollLeft}
              />
            </button>
          </div>
        )}
        <ul
          className="flex gap-7 items-center no-scrollbar overflow-x-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
          ref={ulRef}
        >
          <li className="pb-[0.6rem] pt-1">
            <button className="rounded-full hover:bg-[#f5f5f5]">
              <Plus className="size-5" absoluteStrokeWidth={true} size={40} />
            </button>
          </li>
          {authUser.interestedTopics
            .concat(["for you", "following"])
            .map((topic, index) => {
              return (
                <li
                  key={index}
                  className={`pb-3.5 ${
                    topic !== "for you" && topic !== "following"
                      ? "order-1"
                      : ""
                  } ${
                    activeTopic === topic
                      ? "border-solid border-b-[1px] border-black"
                      : ""
                  }`}
                >
                  <button
                    className="capitalize text-neutral-600 text-[0.8rem] text-nowrap hover:text-black md"
                    onClick={() => handleClick(topic)}
                  >
                    {topic}
                  </button>
                </li>
              );
            })}
        </ul>
        {showRightScrollButton && (
          <div className="pb-[0.6rem] pt-1 order-2">
            <button className="text-neutral-600 hover:text-black">
              <ChevronRight
                className="size-5"
                absoluteStrokeWidth={true}
                size={40}
                onClick={scrollRight}
              />
            </button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-5 py-6">
        {isGettingFeeds && (
          <div className="flex justify-center items-center mt-16">
            <Loader2 className="size-8 animate-spin" />
          </div>
        )}
        <ul className="flex flex-col gap-3">
          {blogs.map((blog, index) => {
            return <BlogCard key={index} cardData={blog} />;
          })}
          {message && (
            <h3 className="mt-4 text-base text-neutral-800 font-semibold">
              {message}
            </h3>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FeedContainer;
