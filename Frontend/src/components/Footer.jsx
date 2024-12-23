import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-primary border-t-[1px] border-solid  border-black px-8 py-5 relative z-5">
      <ul className="flex justify-center items-center gap-4 text-sm text-[#6B6B6B]">
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/blog">Blog</Link>
        </li>
        <li>
          <Link to="/privacy">Privacy</Link>
        </li>
        <li>
          <Link to="/terms">Terms</Link>
        </li>
        <li>
          <Link to="/help">Help</Link>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
