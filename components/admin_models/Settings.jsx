"use client";

import React, { useState } from "react";

const Settings = () => {
  // Clinic Information State
  const [clinicInfo, setClinicInfo] = useState({
    name: "Dr. Rahul Ghuge's Dental Clinic",
    phone: "+91 1234567890",
    address: "123 Main Street, Akurdi, Pune, Maharashtra 411044",
    email: "[EMAIL_ADDRESS]",
    workingHours: "Mon-Sat: 9:00 AM - 6:00 PM",
  });

  // Admin State
  const [adminData, setAdminData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // New Admin State
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle Clinic Info Change
  const handleClinicChange = (e) => {
    setClinicInfo({ ...clinicInfo, [e.target.name]: e.target.value });
  };

  // Handle Clinic Update
  const handleClinicUpdate = () => {
    console.log("Updating clinic info:", clinicInfo);
    alert("Clinic information updated successfully!");
    // Add API call here
  };

  // Handle Password Change
  const handlePasswordChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  // Handle Password Update
  const handlePasswordUpdate = () => {
    if (
      !adminData.currentPassword ||
      !adminData.newPassword ||
      !adminData.confirmPassword
    ) {
      alert("Please fill all password fields");
      return;
    }

    if (adminData.newPassword !== adminData.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    if (adminData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    console.log("Updating password");
    alert("Password updated successfully!");
    setAdminData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    // Add API call here
  };

  // Handle New Admin Change
  const handleNewAdminChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // Handle Add Admin
  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      alert("Please fill all admin fields");
      return;
    }

    if (newAdmin.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    console.log("Adding new admin:", newAdmin);
    alert("New admin added successfully!");
    setNewAdmin({
      name: "",
      email: "",
      password: "",
    });
    // Add API call here
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Clinic Information */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          Clinic Information
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <input
            className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Clinic Name"
            name="name"
            value={clinicInfo.name}
            onChange={handleClinicChange}
          />
          <input
            className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone"
            name="phone"
            value={clinicInfo.phone}
            onChange={handleClinicChange}
          />
          <input
            className="input col-span-2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Address"
            name="address"
            value={clinicInfo.address}
            onChange={handleClinicChange}
          />
          <input
            className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            name="email"
            value={clinicInfo.email}
            onChange={handleClinicChange}
          />
          <input
            className="input border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Working Hours"
            name="workingHours"
            value={clinicInfo.workingHours}
            onChange={handleClinicChange}
          />
        </div>
        <button
          onClick={handleClinicUpdate}
          className="mt-5 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Update Clinic Info
        </button>
      </section>

      {/* Add New Admin */}
      <section className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          Add New Admin
        </h3>
        <div className="space-y-4 max-w-sm">
          <input
            type="text"
            className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin Name"
            name="name"
            value={newAdmin.name}
            onChange={handleNewAdminChange}
          />
          <input
            type="email"
            className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin Email"
            name="email"
            value={newAdmin.email}
            onChange={handleNewAdminChange}
          />
          <input
            type="password"
            className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Admin Password"
            name="password"
            value={newAdmin.password}
            onChange={handleNewAdminChange}
          />
          <button
            onClick={handleAddAdmin}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Add Admin
          </button>
        </div>
      </section>

      {/* Update Password */}
      <section className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 text-lg mb-4">
          Update Password
        </h3>
        <div className="space-y-4 max-w-sm">
          <input
            type="password"
            className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Current Password"
            name="currentPassword"
            value={adminData.currentPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New Password"
            name="newPassword"
            value={adminData.newPassword}
            onChange={handlePasswordChange}
          />
          <input
            type="password"
            className="input w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={adminData.confirmPassword}
            onChange={handlePasswordChange}
          />
          <button
            onClick={handlePasswordUpdate}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
          >
            Update Password
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
