import Link from "next/link";
import React, { useState } from "react";
import AppointmentsContent from "./Appointments";
import Services from "./Services";
import SideBar from "./SideBar";
import ContactMessages from "./ContactMsgs";
import Settings from "./Settings";

const AdminPageContent = () => {
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <SideBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="max-h-200 flex-1 overflow-y-auto">
        {(() => {
          switch (activeTab) {
            case "appointments":
              return <AppointmentsContent />;

            case "services":
              return (
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800">Services</h2>
                  <Services />
                </div>
              );

            case "messages":
              return (
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800">
                    Contact Messages
                  </h2>
                  <ContactMessages />
                </div>
              );

            case "settings":
              return (
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
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
  );
};

export default AdminPageContent;
