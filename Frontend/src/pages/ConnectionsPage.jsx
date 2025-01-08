import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import ProfileSidebar from "../components/ProfileSidebar";
import { useLocation, useParams } from "react-router-dom";
import { useProfileStore } from "../store/useProfileStore";
import ProfileSidebarSkeleton from "../components/Skeleton/ProfileSidebarSkeleton";
import ConnectionsContainer from "../components/ConnectionsContainer";
import UpdateProfileModal from "../components/UpdateProfileModal";

const ConnectionsPage = (props) => {
  const { pathname } = useLocation();

  const { username } = useParams();

  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);

  const {
    profileData,
    isGettingProfile,
    isProfileFetched,
    getProfile,
    setProfileData,
    setIsProfileFetched,
    getConnectionUsers,
    setUsers,
    setIsUsersFetched,
    setAllUsersFetched,
  } = useProfileStore();

  useEffect(() => {
    getProfile(username);
    getConnectionUsers(pathname.split("/")[2], username, 1);
    return () => {
      setProfileData(null);
      setIsProfileFetched(false);
      setUsers([]);
      setIsUsersFetched(false);
      setAllUsersFetched(false);
    };
  }, [username]);

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
        paddingX="px-7"
        paddingY="py-2"
        linksFontSize="text-[0.9rem]"
      />
      <main className="flex-grow">
        <div className="md:max-w-[1328px] md:mx-auto">
          <div className="flex justify-evenly custom-md:flex-col">
            <div className="w-[728px] p-8 pt-12 custom-md:w-full custom-md:order-2 custom-md:pt-0 custom-md:max-w-full">
              {isProfileFetched && (
                <ConnectionsContainer
                  connectionType={pathname.split("/")[2]}
                  profileData={profileData}
                />
              )}
            </div>
            <div className="max-w-[368px] w-full sticky -top-[4.5rem] h-fit border-solid border-l-[1px] border-grey-200 p-8 flex flex-col gap-4 custom-md:max-w-full custom-md:static">
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

export default ConnectionsPage;
