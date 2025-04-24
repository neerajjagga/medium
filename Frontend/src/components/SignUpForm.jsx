import React, { useState } from "react";
import {
  ContactRound,
  UserRoundPen,
  Mail,
  Lock,
  Pen,
  Eye,
  EyeOff,
  Loader,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    emailId: "",
    password: "",
    bio: "",
  });

  const { isSigningUp, signup } = useAuthStore();

  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
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

    if (!formData.emailId.trim()) {
      toast.error("Email is required!");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required!");
      return false;
    }

    if (!validateEmail(formData.emailId)) {
      toast.error("Invalid Email!");
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

    if (formData.password.length < 8) {
      toast.error("Password contains minimum 8 characters!");
      return false;
    }

    if (formData.bio.length > 200) {
      toast.error("Bio contains maximum 200 characters!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const successValidated = validateForm();

    if (successValidated) signup(formData);
  };

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
      <div className="relative">
        <input
          type="text"
          className="w-full border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-3 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900 bg-white"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          name="name"
          required
        />
        <ContactRound className="size-5 absolute top-[50%] translate-y-[-50%] left-2.5 text-neutral-600" />
      </div>
      <div className="relative">
        <input
          type="text"
          className="w-full border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-3 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900 bg-white"
          placeholder="Username"
          value={formData.username}
          onChange={(e) =>
            setFormData({ ...formData, username: e.target.value })
          }
          name="username"
          required
        />
        <UserRoundPen className="size-5 absolute top-[50%] translate-y-[-50%] left-2.5 text-neutral-600" />
      </div>

      <div className="relative">
        <input
          type="email"
          className="w-full border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-3 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900 bg-white"
          placeholder="Email"
          value={formData.emailId}
          onChange={(e) =>
            setFormData({ ...formData, emailId: e.target.value })
          }
          name="email"
          required
        />
        <Mail className="size-5 absolute top-[50%] translate-y-[-50%] left-2.5 text-neutral-600" />
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-9 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900 bg-white"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />
        <Lock className="size-5 absolute top-[50%] translate-y-[-50%] left-2.5 text-neutral-600" />
        <button type="button" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff className="size-5 absolute top-[50%] translate-y-[-50%] right-2.5 text-neutral-600" />
          ) : (
            <Eye className="size-5 absolute top-[50%] translate-y-[-50%] right-2.5 text-neutral-600" />
          )}
        </button>
      </div>

      <div className="relative col-span-full">
        <span className="text-sm">{formData.bio.length}/200</span>
        <textarea
          className="w-full mt-1 border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-2.5 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900 resize-none bg-white"
          rows="4"
          placeholder="Bio"
          maxLength="200"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
        ></textarea>
        <Pen className="size-5 absolute top-9 left-2.5 text-neutral-600" />
      </div>

      <button
        type="submit"
        className="w-full bg-neutral-800 text-white border-[1px] border-transparent border-solid rounded-md px-3 py-1.5 cursor-pointer hover:bg-black flex justify-center items-center"
        disabled={isSigningUp}
      >
        {isSigningUp ? <Loader className="size-6 animate-spin" /> : "Sign Up"}
      </button>
    </form>
  );
};

export default SignUpForm;
