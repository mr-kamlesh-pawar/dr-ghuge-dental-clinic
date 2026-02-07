import { LogOut, X, Menu } from "lucide-react";
import Cookies from "js-cookie";

const SideBar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
            <button 
                onClick={onClose}
                className="p-1 rounded-md hover:bg-gray-100 text-gray-500 md:hidden"
            >
                <X size={24} />
            </button>
        </div>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-3 rounded-lg cursor-pointer text-left transition-colors duration-200 font-medium ${
            activeTab === "appointments"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          Appointments
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-4 py-3 rounded-lg text-left cursor-pointer transition-colors duration-200 font-medium ${
            activeTab === "services"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          Services
        </button>
        <button
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-3 rounded-lg text-left cursor-pointer transition-colors duration-200 font-medium ${
            activeTab === "messages"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          Contact Messages
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-3 rounded-lg text-left cursor-pointer transition-colors duration-200 font-medium ${
            activeTab === "settings"
              ? "bg-blue-50 text-blue-600"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          Settings
        </button>
      </nav>

      <div className="mt-auto border-t border-gray-100 pt-4">
        <button
          onClick={() => {
            Cookies.remove("jwtToken");
            window.location.href = "/admin-login";
          }}
          className="w-full px-4 py-3 rounded-lg text-left cursor-pointer transition-colors duration-200 font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
    </>
  );
};

export default SideBar;
