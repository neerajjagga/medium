import React, { useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FeedContainer from "../components/FeedContainer";

const HomePage = () => {

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
        <div className="md:max-w-[1328px] md:mx-auto">
          <div className="flex justify-evenly">
            <div className="max-w-[728px] p-6 min-h-screen custom-md:w-full custom-md:max-w-full">
              <FeedContainer />
            </div>
            <div className="max-w-[368px] border-solid border-l-[1px] border-grey-200 p-6 custom-md:hidden">
              <Sidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
