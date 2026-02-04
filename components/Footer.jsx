import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 text-sm mt-10">
      <div className="flex items-center justify-between px-6 py-3">
        <span className="ml-20">
          © 2026 Dr Rahul Ghuge's Dental clinic. All rights reserved.
        </span>

        <Link
          href="/admin-login"
          className="font-semibold blur-md hover:blur-none transition duration-300"
        >
          Admin Login
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
