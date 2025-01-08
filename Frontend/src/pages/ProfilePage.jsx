import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import ProfileSidebar from "../components/ProfileSidebar";
import ProfileContainer from "../components/ProfileContainer";
import { useParams } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";
import ProfileSidebarSkeleton from "../components/Skeleton/ProfileSidebarSkeleton";
import UpdateProfileModal from "../components/UpdateProfileModal";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { username } = useParams();

  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

  const { authUser } = useAuthStore();

  const {
    profileData,
    setProfileData,
    isGettingProfile,
    isProfileFetched,
    setIsProfileFetched,
    getProfile,
  } = useProfileStore();

  useEffect(() => {
    getProfile(username);
    return () => {
      setProfileData(null);
      setIsProfileFetched(false);
    };
  }, [username, authUser.profileImgUrl]);

  const handleClick = () => {
    setShowUpdateProfileModal((prevValue) => !prevValue);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {showUpdateProfileModal && (
        <UpdateProfileModal handleClick={handleClick} />
      )}
      <Header
        bgColor="bg-white"
        borderColor="border-gray-200"
        paddingX="px-6"
        paddingY="py-2"
        linksFontSize="text-[0.9rem]"
      />
      <main className="flex-grow">
        <div className="md:max-w-[1328px] md:mx-auto">
          <div className="flex justify-evenly custom-md:flex-col">
            <div className="w-[728px] p-6 pt-12 min-h-screen custom-md:w-full custom-md:order-2 custom-md:pt-0 custom-md:max-w-full">
              {isProfileFetched && (
                <ProfileContainer profileData={profileData} />
              )}
            </div>
            <div className="max-w-[368px] w-full sticky -top-[4.5rem] h-fit border-solid border-l-[1px] border-grey-200 p-6 flex flex-col gap-4 custom-md:max-w-full custom-md:static">
              {isGettingProfile && <ProfileSidebarSkeleton />}
              {isProfileFetched && (
                <ProfileSidebar
                  profileData={profileData}
                  setShowUpdateProfileModal={setShowUpdateProfileModal}
                />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
