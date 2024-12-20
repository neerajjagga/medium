import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Header from "../components/Header";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  const handleClick = () => {
    logout();
  };
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
        <div className="grid grid-cols-12 px-10 min-h-[100vh] md:container md:mx-auto xl:max-w-[1200px]">
          <div className="flex flex-col gap-4 items-start col-span-8 h-full shadow-md border-solid border-r-[1px] border-gray-200 p-8">
            <h1 className="mb-3 text-3xl font-bold">Hello, {authUser.name}</h1>
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold text-2xl">Interested Topics: </h3>
              <ul className="flex gap-2 flex-wrap">
                {authUser.interestedTopics.map((topic, index) => {
                  return (
                    <li
                      key={index}
                      className="bg-neutral-800 text-white rounded-3xl capitalize px-4 py-1.5"
                    >
                      {topic}
                    </li>
                  );
                })}
              </ul>
            </div>
            <button
              onClick={handleClick}
              className="text-neutral-800 px-6 py-1.5 mt-3 border-solid border-2 border-neutral-800 rounded-3xl hover:bg-black hover:text-white"
            >
              Logout
            </button>
          </div>
          <div className="col-span-4 h-full shadow-md p-8"></div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
