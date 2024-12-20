import React, { useState } from "react";
import { X } from "lucide-react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

const SignIn = (props) => {
  const [showSignInForm, setShowSignInForm] = useState(true);
  const { handleClick } = props;
  return (
    <div className="fixed inset-0 z-10 bg-[#f9fafbb0] flex justify-center items-center p-8">
      <div className="w-full relative bg-white shadow-lg p-6 rounded-lg sm:w-9/12 md:w-7/12 min-h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-10 mt-4">
          <h3 className="text-3xl font-semibold">
            {showSignInForm ? "Welcome back" : "Join Medium"}
          </h3>
          {showSignInForm ? <SignInForm /> : <SignUpForm />}
          <div>
            <p>
              {showSignInForm ? "No account? " : "Already have an account? "}
              <button
                className="cursor-pointer text-green-700 font-semibold hover:underline"
                onClick={() => setShowSignInForm(!showSignInForm)}
              >
                {showSignInForm ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>
          {showSignInForm && (
            <div>
              <p className="text-xs text-[#6B6B6B]">
                Forget email or trouble signing in?{" "}
                <a href="/help" className="underline">
                  Get help
                </a>
              </p>
            </div>
          )}
          <div className="text-center">
            <p className="text-xs text-[#6B6B6B] leading-5">
              Click {showSignInForm ? "“Sign in”" : "“Sign up”"} to agree to
              Medium’s{" "}
              <a href="/terms" className="underline">
                Terms of Service
              </a>{" "}
              and acknowledge that Medium’s{" "}
              <a href="/privacy" className="underline">
                Privacy Policy
              </a>{" "}
              applies to you.
            </p>
          </div>
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

export default SignIn;
