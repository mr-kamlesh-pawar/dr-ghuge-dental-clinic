import Link from "next/link";
import React, { useState } from "react";
import AppointmentsContent from "./Appointments";
import Services from "./Services";
import SideBar from "./SideBar";
import ContactMessages from "./ContactMsgs";
import Settings from "./Settings";
import TopBar from "./TopBar"; // Import TopBar locally

const AdminPageContent = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar with mobile state */}
      <SideBar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
            setActiveTab(tab);
            setIsSidebarOpen(false); // Close sidebar on selection (mobile)
        }} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* TopBar with toggle */}
        <TopBar onMenuClick={() => setIsSidebarOpen(true)} />
        
        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full">
          {(() => {
            switch (activeTab) {
              case "appointments":
                return <AppointmentsContent />;

              case "services":
                return (
                  <div className="p-4 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Services</h2>
                    <Services />
                  </div>
                );

              case "messages":
                return (
                  <div className="p-4 md:p-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
                      Contact Messages
                    </h2>
                    <ContactMessages />
                  </div>
                );

              case "settings":
                return (
                  <div className="p-4 md:p-8">
                    {/* Settings component has its own header */}
                    <Settings />
                  </div>
                );

              default:
                return (
                  <div className="p-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome</h2>
                  </div>
                );
            }
          })()}
        </main>
      </div>
    </div>
  );
};

export default AdminPageContent;
