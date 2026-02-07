"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { User, Lock, Plus, Save, Loader2 } from "lucide-react";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Admin Update Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // New Admin State
  const [newAdmin, setNewAdmin] = useState({
    name: "",
   
    password: "",
  });

  // Load current user
  useEffect(() => {
    const fetchUser = async () => {
        try {
            const token = Cookies.get("jwtToken");
            if (!token) return;

            const res = await fetch("/api/verify", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.valid) {
                setCurrentUser(data.user);
            }
        } catch (e) {
            console.error("Failed to load user", e);
        }
    };
    fetchUser();
  }, []);

  // Handle Input Changes
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleNewAdminChange = (e) => {
    setNewAdmin({ ...newAdmin, [e.target.name]: e.target.value });
  };

  // 1. Update Password
  const handlePasswordUpdate = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const token = Cookies.get("jwtToken");
      const res = await fetch("/api/admin/update-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            currentPassword, 
            newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");
        setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
      } else {
        toast.error(data.error || "Failed to update password");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 2. Add New Admin
  const handleAddAdmin = async () => {
    const { name, password } = newAdmin;

    if (!name || !password) {
      toast.error("Username and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
        const token = Cookies.get("jwtToken");
        const res = await fetch("/api/admin/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                name,
               
                password
            })
        });

        const data = await res.json();

        if (res.ok) {
            toast.success("New admin added successfully");
            setNewAdmin({ name: "", password: "" });
        } else {
            toast.error(data.error || "Failed to add admin");
        }
    } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
        <p className="text-gray-500 text-sm mt-1">Manage admin access and security</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
          
        {/* Add New Admin Card */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                        <User size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Add New Admin</h3>
                        <p className="text-sm text-gray-500">Create a new administrator account</p>
                    </div>
                </div>
            </div>
            
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            name="name"
                            value={newAdmin.name}
                            onChange={handleNewAdminChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="e.g. admin"
                        />
                    </div>
                
                    <div className="space-y-2 ">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="text" // Visible for admin creation ease, or convert to password type
                            name="password"
                            value={newAdmin.password}
                            onChange={handleNewAdminChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            placeholder="Set a strong password"
                        />
                         {/* <p className="text-xs text-gray-500">Must be at least 6 characters long</p> */}
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handleAddAdmin}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {loading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                        Create Account
                    </button>
                </div>
            </div>
        </section>

        {/* Update Password Card */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                        <Lock size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">Change Password</h3>
                        <p className="text-sm text-gray-500">Update your current account password</p>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Current Password</label>
                    <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        onClick={handlePasswordUpdate}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Update Password
                    </button>
                </div>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Settings;
