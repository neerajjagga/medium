import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const SignInForm = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });

  const { isSigningIn, signin } = useAuthStore();

  const validateEmail = (email) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const validateForm = () => {
    if (!formData.usernameOrEmail.trim()) {
      toast.error("Username or Email is required!");
      return false;
    }

    if (!formData.password.trim()) {
      toast.error("Password is required!");
      return false;
    }

    if (formData.usernameOrEmail.includes("@")) {
      if (!validateEmail(formData.usernameOrEmail)) {
        toast.error("Invalid Email!");
        return false;
      }
    } else {
      if (formData.usernameOrEmail.length < 5) {
        toast.error("Username contains minimum 5 characters!");
        return false;
      }

      if (formData.usernameOrEmail.length > 15) {
        toast.error("Username contains maximum 15 characters!");
        return false;
      }
    }

    if (formData.password.length < 8) {
      toast.error("Password contains minimum 8 characters!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const successValidate = validateForm();
    if (successValidate) {
      let data;
      if (formData.usernameOrEmail.includes("@")) {
        data = {
          emailId: formData.usernameOrEmail,
          password: formData.password,
          username: null,
        };
      } else {
        data = {
          emailId: null,
          password: formData.password,
          username: formData.usernameOrEmail,
        };
      }
      signin(data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="relative">
        <input
          type="text"
          className="w-full border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-3 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900"
          placeholder="Username or Email"
          value={formData.usernameOrEmail}
          onChange={(e) =>
            setFormData({ ...formData, usernameOrEmail: e.target.value })
          }
          name="email"
          required
        />
        <Mail className="size-5 absolute top-[50%] translate-y-[-50%] left-2.5 text-neutral-600" />
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="w-full border-[1px] border-neutral-600 border-solid rounded-md ps-9 pe-8 py-1.5 outline-none focus:outline-2 focus:outline-double focus:outline-neutral-600 tracking-wide text-neutral-900"
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

      <button
        type="submit"
        className="w-full bg-neutral-800 text-white border-[1px] border-transparent border-solid rounded-md px-3 py-1.5 cursor-pointer hover:bg-black flex justify-center items-center"
        disabled={isSigningIn}
      >
        {isSigningIn ? <Loader className="size-6 animate-spin" /> : "Sign In"}
      </button>
    </form>
  );
};

export default SignInForm;
