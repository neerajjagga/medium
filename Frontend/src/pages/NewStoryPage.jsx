import React, { useEffect, useRef, useState } from "react";
import ProfileModal from "../components/ProfileModal";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Image, Loader2, Plus, Trash2, X } from "lucide-react";
import Tiptap from "../components/Editor/TipTap";
import toast from "react-hot-toast";
import { useBlogStore } from "../store/useBlogStore";

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
  const tagsRef = useRef(null);
  const fileRef = useRef(null);

  const navigate = useNavigate();

  const { isCreatingBlog, createNewBlog } = useBlogStore();

  const [formData, setFormData] = useState({
    title: "",
    subTitle: "",
    tags: [],
    content: "",
    htmlContent: null,
    jsonContent: null,
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    // Delay the autofocus to ensure the editor doesn't take focus first
    setTimeout(() => {
      titleRef.current?.focus();
    }, 50); // Adjust the delay time if needed
  }, []);

  const handleClick = () => {
    if (!tagInput.trim()) {
      return;
    }

    setFormData({ ...formData, tags: [...formData.tags, tagInput] });
    setTagInput("");
  };

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

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required!");
      return;
    }

    if (formData.title.length < 10 || formData.title.length > 50) {
      toast.error("Title must contains min 10 & max 50 characters!");
      return;
    }

    if (formData.content.length > 5000) {
      toast.error("Content contains maximum 5000 characters!");
      return;
    }

    const data = new FormData();
    data.append("thumbnailImage", image);
    data.append("title", formData.title);
    data.append("subTitle", formData.subTitle);
    data.append("content", formData.content);
    data.append("tags", formData.tags);
    data.append("htmlContent", formData.htmlContent);
    data.append("jsonContent", JSON.stringify(formData.jsonContent));

    const blog = await createNewBlog(data);
    navigate(`/${authUser.username}/${blog.titleSlug}`);
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
                  className="rounded-full bg-green-600 w-20 py-2 text-sm font-medium text-white hover:bg-green-700 flex justify-center"
                >
                  {isCreatingBlog ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Publish"
                  )}
                </button>
              </li>
            )}
            {/* {authUser && (
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
            )} */}
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
                required
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
                  } else if (e.key === "Enter") {
                    tagsRef.current.focus();
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
            <div className="relative w-full flex gap-3 items-center">
              {/* Input */}
              <input
                ref={tagsRef}
                type="text"
                id="tags"
                className="peer resize-none text-[1.5rem] tracking-tight outline-none ps-4 pt-4 border-solid border-l-[1px] border-neutral-500 w-full whitespace-pre-wrap placeholder-transparent overflow-hidden"
                placeholder="Tags"
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !tagInput) {
                    subTitleRef.current.focus();
                  }
                }}
                onChange={(e) => setTagInput(e.target.value)}
                value={tagInput}
              />
              {tagInput && (
                <button
                  type="button"
                  className="px-2 py-1.5 bg-neutral-800 text-white text-[0.75rem] rounded-md transition-colors hover:bg-black"
                  onClick={handleClick}
                >
                  Add
                </button>
              )}

              {/* Label */}
              <label
                htmlFor="tags"
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-sm text-neutral-500 ${
                  formData.title ? "top-2" : ""
                } peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-black transition-all`}
              >
                Tags
              </label>
            </div>
            {formData.tags.length > 0 && (
              <ul className="flex gap-1.5 items-center flex-wrap">
                {formData.tags.map((tag) => {
                  return (
                    <li
                      key={tag}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-neutral-800 text-white"
                    >
                      <span className="text-[0.75rem]">{tag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tags: formData.tags.filter((t) => t !== tag),
                          });
                        }}
                      >
                        <X className="size-4" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
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
              <div>
                <h4 className="text-lg text-neutral-800 font-bold mb-2">
                  Thumbnail Image
                </h4>
                <img
                  className="w-3/6 rounded-md"
                  src={imagePreview}
                  alt="Thumbnail Image"
                />
              </div>
            )}
            <Tiptap setFormData={setFormData} />
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewStoryPage;
