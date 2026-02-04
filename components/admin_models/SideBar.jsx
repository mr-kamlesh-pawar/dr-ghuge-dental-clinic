import Link from "next/link";

const SideBar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col p-6 shadow-sm">
      <h2 className="text-2xl font-bold mb-10 text-gray-800">Admin Panel</h2>

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
    </aside>
  );
};

export default SideBar;
