"use client";

import React, { useState } from "react";
import { FileText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const GetReportContainer = () => {
  const [appointmentId, setAppointmentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGetReport = async () => {
    if (!appointmentId.trim()) {
      toast.error("Please enter an appointment ID");
      return;
    }
    if (appointmentId.length !== 16) {
      toast.error("Invalid appointment ID");
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`/api/book-appointment/${appointmentId}`);

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("Report not found for this appointment");
        } else {
          toast.error("Failed to fetch report");
        }
        setIsLoading(false);
        return;
      }

      // Navigate to report view page
      router.push(`/reports?appointmentId=${appointmentId}`);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleGetReport();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-teal-100 p-4 rounded-full">
              <FileText size={40} className="text-teal-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Check Your Appointment Status & Medical Report
          </h1>
          <p className="text-gray-600 text-sm">
            Enter your appointment ID to view your report
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="appointmentId"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Appointment ID
            </label>
            <input
              type="text"
              id="appointmentId"
              value={appointmentId}
              maxLength={16}
              onChange={(e) => setAppointmentId(e.target.value.trim())}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g., AABHA-MI923-CCZF"
              disabled={isLoading}
            />
          </div>

          <button
            onClick={handleGetReport}
            disabled={isLoading}
            className="w-full cursor-pointer px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={20} />
            {isLoading ? "Loading..." : "Get Report"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your appointment ID was sent to you via SMS/Email
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetReportContainer;
