import { CircleMinus, Ellipsis } from "lucide-react";
import React from "react";
import { formatMongoDate } from "../lib/utils";
import {Link} from "react-router-dom";

const BlogCard = (props) => {
  const {
    title,
    creator,
    subtitle,
    titleSlug,
    thumbnailUrl,
    publishAt,
    clapCount,
    postResponseCount,
  } = props.cardData;

  return (
    <li className="grid grid-cols-3 pt-3 pb-6 border-solid border-gray-200 border-b-[1px]">
      {creator && (
        <div className="mb-1.5">
          <Link 
            to={`/${creator.username}`}
            className="flex items-center gap-1.5 "
          >
            <img
              src={creator.profileImgUrl}
              alt={creator.name}
              className="size-5 object-cover rounded-full hover:shadow-sm"
            />
            <span className="text-[0.8rem] mb-[0.2rem] capitalize hover:underline">
              {creator.name}
            </span>
          </Link>
        </div>
      )}
      <Link
        to={`/${creator ? creator.username : props.username}/${titleSlug}`}
        className="col-span-3 grid grid-cols-3 sm:grid-cols-12 justify-between gap-8"
      >
        <div className="col-span-2 sm:col-span-8 flex flex-col gap-2 justify-center">
          <h2 className="text-lg sm:text-xl md:text-2xl tracking-tighter leading-6 font-bold capitalize text-neutral-800">
            {title}
          </h2>
          <h3 className="text-[0.75rem] text-stone-500 leading-[1.25rem] sm:text-[0.85rem] md:text-[0.9rem]">{subtitle.slice(0, 100)}...</h3>
        </div>
        <div className="col-span-1 sm:col-span-4">
          <img
            src={thumbnailUrl}
            alt={title}
            className="object-cover rounded-sm"
          />
        </div>
      </Link>
      <div className="col-span-3 flex justify-between items-center mt-2 gap-2 md:col-span-2 sm:col-span-3">
        <div className="flex gap-4 items-center">
          <div className="flex gap-3 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 64 64"
            >
              <path
                fill="#FFC017"
                d="m39.637 40.831-5.771 15.871a1.99 1.99 0 0 1-3.732 0l-5.771-15.87a2.02 2.02 0 0 0-1.194-1.195L7.298 33.866a1.99 1.99 0 0 1 0-3.732l15.87-5.771a2.02 2.02 0 0 0 1.195-1.194l5.771-15.871a1.99 1.99 0 0 1 3.732 0l5.771 15.87a2.02 2.02 0 0 0 1.194 1.195l15.871 5.771a1.99 1.99 0 0 1 0 3.732l-15.87 5.771a2.02 2.02 0 0 0-1.195 1.194"
              ></path>
            </svg>
            <span className="text-[0.75rem] text-stone-500">
              {formatMongoDate(publishAt)}
            </span>
          </div>
          <div className="flex gap-1 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                fill="#6B6B6B"
                d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="text-[0.75rem] text-stone-500">{clapCount}</span>
          </div>
          <div className="flex gap-0.5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="#6B6B6B"
              viewBox="0 0 16 16"
            >
              <path
                fill="#6B6B6B"
                d="M12.344 11.458A5.28 5.28 0 0 0 14 7.526C14 4.483 11.391 2 8.051 2S2 4.483 2 7.527c0 3.051 2.712 5.526 6.059 5.526a6.6 6.6 0 0 0 1.758-.236q.255.223.554.414c.784.51 1.626.768 2.512.768a.37.37 0 0 0 .355-.214.37.37 0 0 0-.03-.384 4.7 4.7 0 0 1-.857-1.958v.014z"
              ></path>
            </svg>
            <span className="text-[0.75rem] text-stone-500">
              {postResponseCount}
            </span>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          {creator && (
            <button className="text-stone-500 hover:text-black">
              <CircleMinus
                className="size-5"
                absoluteStrokeWidth={true}
                size={40}
              />
            </button>
          )}
          <button className="hidden sm:block text-stone-500 hover:text-neutral-800">
            <i className="fa fa-bookmark-o" aria-hidden="true"></i>
          </button>
          <button className="text-stone-500 hover:text-neutral-800">
            <Ellipsis className="size-5" />
          </button>
        </div>
      </div>
      <div></div> {/* Empty div to fix the layout */}
    </li>
  );
};

export default BlogCard;
