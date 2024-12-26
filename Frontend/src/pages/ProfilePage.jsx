import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { Link, useLocation } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";
import ProfileSidebarSkeleton from "../components/Skeleton/profileSidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { Ellipsis } from "lucide-react";
import { formatFollowers } from "../lib/utils";

const ProfilePage = () => {
  const { pathname } = useLocation();

  const {
    profileData,
    isGettingProfile,
    isProfileFetched,
    setIsProfileFetched,
    getProfile,
    followUser,
    unfollowUser,
  } = useProfileStore();

  const { authUser } = useAuthStore();
  const [isFollowing, setIsFollowing] = useState(null);

  useEffect(() => {
    getProfile(pathname);
    return setIsProfileFetched(false);
  }, []);

  useEffect(() => {
    console.log(profileData, isProfileFetched);
    if (isProfileFetched) {
      setIsFollowing(profileData.followers.includes(authUser._id));
    }
  }, [profileData]);

  const handleClick = async () => {
    if (isFollowing) {
      await unfollowUser(profileData.username);
    } else {
      await followUser(profileData.username);
    }
    setIsProfileFetched(false);
    setIsFollowing((prev) => !prev);
    getProfile(pathname);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        bgColor="bg-white"
        borderColor="border-gray-200"
        paddingX="px-7"
        paddingY="py-2"
        linksFontSize="text-[0.9rem]"
      />
      <main className="flex-grow">
        <div className="md:max-w-[1328px] md:mx-auto">
          <div className="flex justify-evenly">
            <div className="max-w-[728px] p-8 min-h-screen"></div>
            <div className="max-w-[368px] border-solid border-l-[1px] border-grey-200 p-8 flex flex-col gap-4">
              {isGettingProfile && <ProfileSidebarSkeleton />}
              {isProfileFetched && (
                <div className="flex flex-col gap-10">
                  <div className="flex flex-col gap-2.5 items-start">
                    <div className="size-[6rem] -ms-2">
                      <img
                        src={profileData.profileImgUrl}
                        alt={profileData.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="flex gap-2 items-end">
                      <h2 className="text-base font-bold text-neutral-700 break-words">
                        {profileData.name}
                      </h2>
                      <span
                        className="text-[0.9rem] text-neutral-600"
                        style={{ wordSpacing: -0.25 }}
                      >
                        he/him
                      </span>
                    </div>
                    {profileData.username === authUser.username ? (
                      <button className="text-green-700 mt-2 text-sm hover:text-black transition-colors">
                        Edit profile
                      </button>
                    ) : (
                      <div className="flex flex-col gap-2.5 items-start">
                        <h3 className="text-base text-neutral-600">
                          {formatFollowers(profileData.followersCount)} Followers
                        </h3>
                        <p className="text-[0.8rem] text-neutral-600">
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
                  </div>
                  {profileData.following.length !== 0 &&
                    profileData.username !== authUser.username && (
                      <div className="flex flex-col gap-2.5">
                        <h2 className="text-base font-bold text-neutral-700 break-words">
                          Following
                        </h2>
                        <ul className="flex flex-col gap-2">
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
                                    <span className="text-[0.8rem]">
                                      {user.name}
                                    </span>
                                  </a>
                                </div>
                                <button className="px-[0.35rem] py-[0.4rem] rounded-md text-stone-500 hover:text-neutral-800 hover:bg-gray-100">
                                  <Ellipsis className="size-5" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
