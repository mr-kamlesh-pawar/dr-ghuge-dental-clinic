import React from "react";
import Cookies from "js-cookie";

const TopBar = () => {
  const date = new Date();
  const formatted = date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Dr Rahul Ghuge's Dental clinic
        </h3>
        <p className="text-sm text-gray-500">Login time: {formatted}</p>
      </div>
      <button
        onClick={() => {
          Cookies.remove("jwtToken");
          window.location.href = "/admin-login";
        }}
        type="button"
        className="px-4 py-2 text-sm font-medium cursor-pointer text-white bg-red-500 rounded hover:bg-red-600 transition"
      >
        Log Out
      </button>
    </div>
  );
};

export default TopBar;
