import React, { useEffect, useState } from "react";
import { Ellipsis } from "lucide-react";
import { formatFollowers } from "../lib/utils";
import { useProfileStore } from "../store/useProfileStore";
import { useAuthStore } from "../store/useAuthStore";

const ProfileSidebar = ({ profileData }) => {
  const { followUser, unfollowUser } = useProfileStore();

  const { authUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(profileData.followers.includes(authUser._id));
  const [followersCount, setFollowersCount] = useState(profileData.followersCount);

  const handleClick = async () => {
    if (isFollowing) {
      await unfollowUser(profileData.username);
      setFollowersCount((prev) => prev - 1);
    } else {
      await followUser(profileData.username);
      setFollowersCount((prev) => prev + 1);
    }
    setIsFollowing((prev) => !prev);
  };

  return (
    <div className="flex flex-col gap-10">
      {profileData.username !== authUser.username && (
        <div className="flex flex-col gap-2.5 items-start custom-md:flex-row custom-md: justify-between">
          <div className="flex flex-col gap-2.5 items-start custom-md:flex-row custom-md:gap-3.5">
            <div className="size-[6rem] -ms-2 custom-md:size-[3.5rem] custom-md:ms-0">
              <img
                src={profileData.profileImgUrl}
                alt={profileData.name}
                className="size-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-2 custom-md:gap-1.5 custom-md:mt-0.5">
              <div className="flex gap-2 items-end">
                <h2 className="text-base font-bold text-neutral-700 tracking-tight break-words custom-md:text-2xl custom-md:font-medium">
                  {profileData.name}
                </h2>
                <span
                  className="text-[0.9rem] text-neutral-600 custom-md:hidden"
                  style={{ wordSpacing: -0.25 }}
                >
                  he/him
                </span>
              </div>
              <h3 className="text-[0.95rem] text-neutral-600 custom-md:text-base">
                {formatFollowers(followersCount)} Followers
              </h3>
            </div>
          </div>
          <p className="text-[0.8rem] text-neutral-600 custom-md:hidden">
            {profileData.bio}
          </p>
          <button
            className={`mt-3 text-[0.925rem] px-4 py-1.5 border-solid border-[1px] border-green-700 rounded-3xl ${
              isFollowing
                ? "bg-white text-green-700 hover:bg-gray-200"
                : "bg-green-700 text-white hover:bg-green-800"
            }`}
            onClick={handleClick}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      )}
      {profileData.username === authUser.username && (
        <div className="flex flex-col gap-4 items-start">
          <div className="flex flex-col gap-2.5">
            <div className="size-[6rem] -ms-2 custom-md:size-[3.5rem] custom-md:ms-0">
              <img
                src={profileData.profileImgUrl}
                alt={profileData.name}
                className="size-full object-cover"
              />
            </div>
            <h2 className="text-base font-bold text-neutral-700 tracking-tight break-words custom-md:text-2xl custom-md:font-medium">
              {profileData.name}
            </h2>
          </div>
          <button className="text-green-600 text-[0.75rem] ms-0.5 cursor-pointer hover:text-black">
            Edit profile
          </button>
        </div>
      )}
      {profileData.following.length !== 0 &&
        profileData.username !== authUser.username && (
          <div className="flex flex-col gap-3 items-start custom-md:hidden">
            <h2 className="text-base font-bold text-neutral-700 break-words">
              Following
            </h2>
            <ul className="flex flex-col gap-2 w-full">
              {profileData.following.map((user, index) => {
                return (
                  <li
                    className="flex justify-between items-center gap-4"
                    key={index}
                  >
                    <div>
                      <a
                        href={`/${user.username}`}
                        className="flex items-center gap-2.5 hover:underline"
                      >
                        <img
                          className="size-6 object-cover"
                          src={user.profileImgUrl}
                          alt={user.name}
                        />
                        <span className="text-[0.8rem]">{user.name}</span>
                      </a>
                    </div>
                    <button className="px-[0.35rem] py-[0.4rem] rounded-md text-stone-500 hover:text-neutral-800 hover:bg-gray-100">
                      <Ellipsis className="size-5" />
                    </button>
                  </li>
                );
              })}
            </ul>
            {profileData.following.length === 5 && (
              <a
                href={`/${profileData.username}/following`}
                className="ms-1 text-[0.775rem] text-neutral-700 tracking-tight hover:text-black hover:underline"
              >
                See all {`(${profileData.followingCount})`}
              </a>
            )}
          </div>
        )}
    </div>
  );
};

export default ProfileSidebar;
