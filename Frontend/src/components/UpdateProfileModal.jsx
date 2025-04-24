import React, { useEffect, useRef, useState } from "react";
import { Lock, X } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useProfileStore } from "../store/useProfileStore";
import { useNavigate } from "react-router-dom";

const UpdateProfileModal = ({ handleClick }) => {
  const { authUser } = useAuthStore();

  const { updateProfile, isUpdatingProfile } = useProfileStore();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: authUser.name,
    username: authUser.username,
    bio: authUser.bio,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [image, setImage] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    // remove window scrollbar
    document.body.style.overflow = "hidden";
    // show window scrollbar
    return () => (document.body.style.overflow = "");
  }, []);

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

  const isDataChanged = () => {
    if (
      authUser.name === formData.name.trim() &&
      authUser.username === formData.username.trim() &&
      authUser.bio === formData.bio.trim() &&
      image === null
    ) {
      return false;
    }
    return true;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required!");
      return false;
    }

    if (!formData.username.trim()) {
      toast.error("Username is required!");
      return false;
    }

    if (formData.username.length < 5) {
      toast.error("Username contains minimum 5 characters!");
      return false;
    }

    if (formData.username.length > 15) {
      toast.error("Username contains maximum 15 characters!");
      return false;
    }

    if (formData.name.length < 3) {
      toast.error("Name contains minimum 3 characters!");
      return false;
    }

    if (formData.name.length > 25) {
      toast.error("Username contains maximum 25 characters!");
      return false;
    }
    if (formData.username.length < 5) {
      toast.error("Username contains minimum 5 characters!");
      return false;
    }

    if (formData.username.length > 15) {
      toast.error("Username contains maximum 15 characters!");
      return false;
    }

    if (formData.name.length < 3) {
      toast.error("Name contains minimum 3 characters!");
      return false;
    }

    if (formData.name.length > 25) {
      toast.error("Username contains maximum 25 characters!");
      return false;
    }

    if (formData.bio.length > 200) {
      toast.error("Bio contains maximum 200 characters!");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const successValidated = validateForm();

    if (successValidated) {
      if (isDataChanged()) {
        const data = new FormData();
        data.append("profileImage", image);
        data.append("name", formData.name);
        data.append("username", formData.username);
        data.append("bio", formData.bio);

        const updatedUser = await updateProfile(data);
        if (updatedUser) {
          navigate(`/${updatedUser.username}`);
          handleClick();
          return;
        }
      }
      return;
    }
  };

  return (
    <div className="fixed inset-0 z-10 bg-[#3232325a] flex justify-center items-start p-8 overflow-y-auto">
      <div className="w-full relative bg-white shadow-lg p-6 rounded-lg sm:w-[33rem]">
        <div className="flex flex-col gap-10 mt-3">
          <h3 className="text-2xl font-semibold tracking-tight text-center w-full">
            {"Profile information"}
          </h3>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <span className="text-[0.92rem] text-neutral-700 tracking-normal -mb-4">
              Photo
            </span>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className="flex flex-col gap-3 items-start md:flex-row md:items-center md:gap-5">
              <div className="size-[6rem]">
                <img
                  src={imagePreview || authUser.profileImgUrl}
                  alt={authUser.name}
                  className="object-cover rounded-full aspect-square border-solid border-[1px] border-green-700"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <button
                    type="button"
                    className="text-[0.9rem] text-green-600 cursor-pointer tracking-tight hover:text-green-800"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Update
                  </button>
                </div>
                <p className="text-sm text-neutral-700 tracking-normal hidden md:block">
                  Recommended: Square JPG, PNG, or GIF, at least 1,000 pixels
                  per side.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm tracking-tight">
                Name*
              </label>
              <input
                type="text"
                id="name"
                className="outline-none border-solid border-[1px] border-transparent bg-gray-100 px-3 py-2 rounded-md text-[0.9rem] tracking-tight font-semibold focus:border-black"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                minLength={3}
                maxLength={25}
                required
              />
              <span className="text-sm self-end">
                <span className="font-semibold">{formData.name.length}</span>/25
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="username" className="text-sm tracking-tight">
                Username*
              </label>
              <input
                type="text"
                id="username"
                className="border-solid border-[1px] border-transparent outline-none bg-gray-100 px-3 py-2 rounded-md text-[0.9rem] tracking-tight font-semibold focus:border-black"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                minLength={5}
                maxLength={15}
                required
              />
              <span className="text-sm self-end">
                <span className="font-semibold">
                  {formData.username.length}
                </span>
                /15
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="bio" className="text-sm tracking-tight">
                Bio
              </label>
              <textarea
                id="bio"
                className="border-solid border-[1px] border-transparent outline-none bg-gray-100 px-3 py-2 rounded-md text-[0.9rem] tracking-tight font-semibold resize-none focus:border-black"
                value={formData.bio}
                rows={3}
                maxLength={200}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              ></textarea>
              <span className="text-sm self-end">
                <span className="font-semibold">{formData.bio.length}</span>/200
              </span>
            </div>
            <div className="flex justify-end">
              <div className="flex gap-3 items-center">
                {!isUpdatingProfile && (
                  <button
                    type="button"
                    className="px-4 py-2 capitalize rounded-3xl border-solid border-[1px] border-green-700 text-[0.9rem] text-green-700 tracking-tight hover:bg-green-700 hover:text-white"
                    onClick={handleClick}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isUpdatingProfile || !isDataChanged()}
                  className={`px-4 py-2 capitalize rounded-3xl border-solid border-[1px] border-green-700 text-[0.9rem] tracking-tight hover:bg-green-700 hover:text-white ${
                    isUpdatingProfile || !isDataChanged()
                      ? "bg-green-700 text-white opacity-60"
                      : "bg-white text-green-700"
                  }`}
                >
                  {isUpdatingProfile ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="absolute top-5 right-5">
          <button
            onClick={handleClick}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
