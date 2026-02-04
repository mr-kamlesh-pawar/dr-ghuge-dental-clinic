"use client";

import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  Pill,
  CalendarClock,
  IndianRupee,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Download,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Report from "@/components/Report";

const ReportsPage = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ReportsPageContent />
    </React.Suspense>
  );
};

const ReportsPageContent = () => {
  const params = useSearchParams();
  const id = params.get("appointmentId");
  const [appointment, setAppointment] = useState({
    name: "",
    appointment_id: "",
    status: "",
    preferred_date: "",
    preferred_time: "",
    at: "",
    name: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    if (id == null) return;
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/book-appointment/${id}`);
        const result = await response.json();
        setAppointment(result.data);
      } catch (error) {
        toast.error("Error while fetching report");
      }
    };

    fetchData();
  }, [id]);

  const getStatusBadge = (status) => {
    const variants = {
      Booked: "bg-blue-100 text-blue-800 border-blue-200",
      Confirmed: "bg-green-100 text-green-800 border-green-200",
      Completed: "bg-gray-100 text-gray-800 border-gray-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    };

    return variants[status] || variants.Booked;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-linear-to-r from-teal-600 to-teal-700 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${getStatusBadge(appointment.status)}`}
              >
                {appointment.status}
              </span>
              <p className="text-blue-100 text-sm mt-2">
                ID: {appointment.appointment_id}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-3">
              <Calendar size={20} className="text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Date</p>
                <p className="font-medium">{appointment.preferred_date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock size={20} className="text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Time</p>
                <p className="font-medium">{appointment.preferred_time}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Clinic</p>
                <p className="font-medium">{appointment.at}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User size={20} className="text-blue-200" />
              <div>
                <p className="text-xs text-blue-200">Doctor</p>
                <p className="font-medium">Bhushan Talle</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Patient Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <User size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{appointment.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Age</p>
                <p className="font-medium text-gray-900">null years</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{appointment.phone}</p>
              </div>
            </div>
          </div>

          {appointment.email && (
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <Mail size={18} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-900">{appointment.email}</p>
              </div>
            </div>
          )}
        </div>
        {appointment.status !== "" ? (
          <Report id={appointment.appointment_id} />
        ) : (
          <p>All reports appear here..</p>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
