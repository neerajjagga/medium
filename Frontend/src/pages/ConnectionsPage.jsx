import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import ProfileSidebar from "../components/ProfileSidebar";
import { useLocation } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";
import ProfileSidebarSkeleton from "../components/Skeleton/ProfileSidebarSkeleton";
import { useAuthStore } from "../store/useAuthStore";

const ConnectionsPage = () => {
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
    getProfile('/' + pathname.split('/')[1]);
    return setIsProfileFetched(false);
  }, []);

  useEffect(() => {
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
          <div className="flex justify-evenly custom-md:flex-col">
            <div className="max-w-[728px] p-8 min-h-screen custom-md:order-2"></div>
            <div className="sidebar max-w-[368px] border-solid border-l-[1px] border-grey-200 p-8 flex flex-col gap-4">
              {isGettingProfile && <ProfileSidebarSkeleton />}
              {isProfileFetched && (
                <ProfileSidebar
                  authUser={authUser}
                  profileData={profileData}
                  isFollowing={isFollowing}
                  handleClick={handleClick}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConnectionsPage;
