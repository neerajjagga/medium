import React, { useEffect, useRef, useState } from "react";
import ProfileModal from "../components/ProfileModal";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import { Bell, Image, Trash2 } from "lucide-react";
import Tiptap from "../components/Editor/TipTap";
import toast from "react-hot-toast";

const NewStoryPage = () => {
  const { pathname } = useLocation();
  const { authUser } = useAuthStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);

  const profileModalRef = useRef(null);
  const profileImgRef = useRef(null);

  const titleRef = useRef(null);
  const subTitleRef = useRef(null);
  const fileRef = useRef(null);
  const editor = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
  });

  useEffect(() => {
    // Delay the autofocus to ensure the editor doesn't take focus first
    setTimeout(() => {
      titleRef.current?.focus();
    }, 50); // Adjust the delay time if needed
  }, []);

  const handleMouseDown = (e) => {
    if (
      profileImgRef.current &&
      profileModalRef.current &&
      !profileModalRef.current.contains(e.target) &&
      !profileImgRef.current.contains(e.target)
    ) {
      setShowProfileModal((prev) => !prev);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file!");
      return;
    }

    setImage(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setImagePreview(base64Image);
    };
  };


  const handlePublish = () => {

    if(!formData.title.trim()){
      toast.error("Title is required!");
      return;
    }
    
    

  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white w-full relative" style={{ zIndex: 5 }}>
        <div className="max-w-[1072px] mx-auto w-full flex justify-between items-center px-6 py-2">
          <div className="text-3xl capitalize">
            <Link to="/">Medium</Link>
          </div>

          <ul className="flex items-center gap-7 capitalize">
            {authUser && (
              <li>
                <button
                  onClick={handlePublish}
                  className="rounded-full bg-green-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Publish
                </button>
              </li>
            )}
            {authUser && (
              <li>
                <Link
                  to="/me/notifications"
                  className="text-neutral-700 hover:text-black"
                >
                  <Bell
                    className="size-5"
                    fill={pathname === "/me/notifications" ? "black" : "white"}
                    absoluteStrokeWidth={true}
                    size={32}
                  />
                </Link>
              </li>
            )}
            {authUser && (
              <li
                className="cursor-pointer hover:shadow-sm"
                onClick={() => {
                  setShowProfileModal((prev) => !prev);
                }}
                ref={profileImgRef}
              >
                <img
                  className="size-8 object-cover rounded-full"
                  src={authUser.profileImgUrl}
                  alt={authUser.name}
                />
              </li>
            )}
            {!authUser && (
              <li>
                <button onClick={handleClick}>Sign in</button>
              </li>
            )}
            {!authUser && (
              <li>
                <button
                  className="px-5 py-2.5 bg-neutral-800 rounded-3xl text-white hover:bg-black"
                  onClick={handleClick}
                >
                  Get started
                </button>
              </li>
            )}
          </ul>
        </div>
        {showProfileModal && (
          <ProfileModal
            profileModalRef={profileModalRef}
            handleMouseDown={handleMouseDown}
          />
        )}
      </header>
      <main>
        <div className="w-full mx-auto px-6 py-8 md:max-w-[872px]">
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
            autoComplete="off"
          >
            <div className="relative w-full">
              {/* Input */}
              <input
                ref={titleRef}
                type="text"
                id="title"
                className="peer resize-none text-[2.5rem] tracking-tight outline-none ps-4 pt-4 border-solid border-l-[1px] border-neutral-500 w-full whitespace-pre-wrap placeholder-transparent overflow-hidden"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    subTitleRef.current.focus();
                  }
                }}
                minLength="10"
                maxLength="50"
              />

              {/* Label */}
              <label
                htmlFor="title"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500 ${
                  formData.title ? "top-2" : ""
                } peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-black transition-all`}
              >
                Title
              </label>
            </div>
            <div className="relative w-full">
              {/* Input */}
              <input
                ref={subTitleRef}
                type="text"
                id="subTitle"
                className="peer text-2xl tracking-tight outline-none ps-4 pt-4 border-solid border-l-[1px] border-neutral-500 w-full resize-y whitespace-pre-wrap placeholder-transparent"
                placeholder="Title"
                value={formData.subTitle}
                onChange={(e) =>
                  setFormData({ ...formData, subTitle: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !formData.subTitle) {
                    titleRef.current.focus();
                  }
                }}
                maxLength="150"
              />

              {/* Label */}
              <label
                htmlFor="subTitle"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500 ${
                  formData.subTitle ? "top-2" : ""
                } peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-black transition-all`}
              >
                Subtitle
              </label>
            </div>
            <div className="relative w-full">
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
              <div className="flex items-center gap-3">
                {!imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      if (fileRef.current) {
                        fileRef.current.click();
                      }
                    }}
                    className="bg-neutral-800 text-white px-3 py-2 rounded-md text-sm tracking-wide transition-colors hover:bg-black flex gap-2.5 items-center"
                  >
                    <span>Upload</span>
                    <Image className="w-4" />
                  </button>
                )}
                {imagePreview && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="bg-red-600 text-white px-3 py-2 rounded-md text-sm tracking-wide transition-colors hover:bg-red-800 flex gap-2.5 items-center"
                  >
                    <span>Remove</span>
                    <Trash2 className="w-4" />
                  </button>
                )}
              </div>
            </div>
            {imagePreview && (
              <img
                className="w-3/6 rounded-md"
                src={imagePreview}
                alt="Thumbnail Image"
              />
            )}
            <Tiptap />
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewStoryPage;
