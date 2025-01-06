import React, { useState } from "react";
import { Ellipsis, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

const NewStoryPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Editor />
    </div>
  );
};

const Editor = () => {
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");

  return (
    <main className="container mx-auto px-4 py-6 relative">
      <div className="flex flex-col gap-4 ml-10">
        <div className="flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border-none text-4xl font-serif placeholder-gray-300 focus:outline-none"
          />
        </div>
        <div className="flex-1">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Tell your story..."
            className="w-full border-none text-xl placeholder-gray-300 focus:outline-none resize-none"
            rows={50}
          />
        </div>
      </div>
    </main>
  );
};

const Header = () => {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="text-3xl capitalize">
          <Link to="/">Medium</Link>
        </div>
        <div className="flex items-center gap-6">
          <button className="bg-green-600 text-white px-4 py-1 rounded-full text-md hover:bg-green-700 transition-colors">
            Publish
          </button>
          <Ellipsis className="text-gray-600" />
          <Bell className="text-gray-600" />
          <div className="h-9 w-9 rounded-full bg-green-600 flex items-center justify-center text-white font-medium">
            <User />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewStoryPage;
