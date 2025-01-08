import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SignIn from "../components/AuthForms";

const WelcomePage = () => {
  const [showAuthFrom, setShowAuthForm] = useState(false);

  const handleClick = () => {
    setShowAuthForm((prevValue) => !prevValue);
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showAuthFrom && <SignIn handleClick={handleClick} />}
      <Header handleClick={handleClick} bgColor="bg-primary" borderColor="border-black" paddingX="px-8" paddingY="py-5" linksFontSize="text-sm" container="md:container" marginX="md:mx-auto" />
      <main className="bg-primary relative flex-grow overflow-hidden">
        <div className="w-full md:container md:mx-auto px-8 py-5">
          <div className="flex flex-col gap-12 items-start mt-12">
            <h1
              className="capitalize text-[80px] sm:text-[100px] md:text-[120px] 
            leading-[0.9] tracking-tighter -ml-1"
            >
              Human <br />
              stories & ideas
            </h1>
            <p className="text-[#242424] text-2xl">
              A place to read, write, and deepen your understanding
            </p>
            <button onClick={handleClick} className="px-10 py-2.5 bg-neutral-800 rounded-3xl text-white text-xl font-semibold hover:bg-black">
              Start reading
            </button>
          </div>
        </div>
        <div className="absolute -top-9 -right-2 custom-md:hidden">
          <img
            src="/assets/media/hero.webp"
            alt="Brand Image"
            width="460"
            height="600"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WelcomePage;
