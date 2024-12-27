import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FeedContainer from "../components/FeedContainer";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();

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
            <div className="max-w-[728px] p-4 min-h-screen custom-md:w-full custom-md:max-w-full">
              <FeedContainer />
            </div>
            <div className="max-w-[368px] border-solid border-l-[1px] border-grey-200 p-8 custom-md:hidden">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
