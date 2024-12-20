import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary border-t-[1px] border-solid  border-black px-8 py-5 relative z-5">
      <ul className="flex justify-center items-center gap-4 text-sm text-[#6B6B6B]">
        <li>
          <a href="/about">About</a>
        </li>
        <li>
          <a href="/blog">Blog</a>
        </li>
        <li>
          <a href="/privacy">Privacy</a>
        </li>
        <li>
          <a href="/terms">Terms</a>
        </li>
        <li>
          <a href="/help">Help</a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
