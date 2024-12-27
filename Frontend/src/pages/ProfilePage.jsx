import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileContainer from "../components/ProfileContainer";
import { useLocation } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";
import ProfileSidebarSkeleton from "../components/Skeleton/ProfileSidebarSkeleton";

const ProfilePage = () => {
  const { pathname } = useLocation();

  const {
    profileData,
    isGettingProfile,
    isProfileFetched,
    setIsProfileFetched,
    getProfile,
  } = useProfileStore();

  useEffect(() => {
    getProfile(pathname);
    return () => setIsProfileFetched(false);
  }, []);

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
            <div className="w-[728px] p-8 pt-12 min-h-screen custom-md:w-full custom-md:order-2 custom-md:pt-0 custom-md:max-w-full">
              {isProfileFetched && (
                <ProfileContainer profileData={profileData} />
              )}
            </div>
            <div className="max-w-[368px] w-full sticky -top-8 h-fit border-solid border-l-[1px] border-grey-200 p-8 flex flex-col gap-4 custom-md:max-w-full">
              {isGettingProfile && <ProfileSidebarSkeleton />}
              {isProfileFetched && <ProfileSidebar profileData={profileData} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
