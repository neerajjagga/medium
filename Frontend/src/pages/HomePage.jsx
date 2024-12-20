import React from "react";
import { useAuthStore } from "../store/useAuthStore";
import Header from "../components/Header";

const HomePage = () => {
  const { authUser, logout } = useAuthStore();
  const handleClick = () => {
    logout();
  };
  return (
    <div>
      <Header bgColor="bg-white" borderColor="border-gray-200" paddingX="px-3" paddingY="py-2" linksFontSize="text-[0.9rem]" />
      <div>
        <h1>Welcome To Medium</h1>
        <h2>Hello {authUser.name}</h2>
        <img src={authUser.profileImgUrl} alt="" />
        <button onClick={handleClick}>Logout</button>
      </div>
    </div>
  );
};

export default HomePage;
