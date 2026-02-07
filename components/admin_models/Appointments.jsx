"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  RefreshCw,
  Bell,
  User,
  Stethoscope,
  Hospital,
  Mail,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  APPOINTMENT_CONFIRMED_EMAIL,
  APPOINTMENT_CANCELLED_EMAIL,
} from "@/model/emailTemplates";

// Debounce hook for search
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const AppointmentsContent = () => {
  const router = useRouter();
  
  // State
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // Filters & Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [limit] = useState(10); // Items per page
  
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(""); // YYYY-MM-DD format
  const [updatingId, setUpdatingId] = useState(null);

  const fetchAppointments = useCallback(async () => {
  setLoading(true);
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (statusFilter && statusFilter !== "All") params.append("status", statusFilter);
    
    if (dateFilter) {
      params.append("date", dateFilter);
    }
    
    if (debouncedSearch) params.append("search", debouncedSearch);

    const response = await fetch(`/api/book-appointment?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      // console.error('API Error:', errorText);
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      setAppointments(data.data || []);
      setTotalRecords(data.meta?.total || 0);
      setTotalPages(data.meta?.totalPages || 0);
    } else {
      setAppointments([]);
      toast.error(data.error || "Failed to load appointments");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    toast.error(error.message || "Failed to load appointments");
    setAppointments([]);
  } finally {
    setLoading(false);
  }
}, [page, limit, statusFilter, dateFilter, debouncedSearch]);

  // Initial fetch and refetch on filter change
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, dateFilter, debouncedSearch]);

  const sendConfirmationEmail = async (appointment) => {
    try {
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: appointment.email,
          subject: "Your Appointment is Confirmed – Dr Rahul Ghuge's Dental clinic",
          text: `Dear ${appointment.name || "Patient"}`,
          html: APPOINTMENT_CONFIRMED_EMAIL({
            patientName: appointment.name || "Patient",
            appointmentId: appointment.appointment_id || appointment.id,
            date: appointment.preferred_date, // Already formatted in backend
            time: appointment.preferred_time,
            clinic: appointment.at || "Dr Rahul Ghuge's Dental clinic",
          }),
        }),
      });

      if (response.ok) {
        toast.success("Confirmation email sent");
      }
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };

  const sendCancellationEmail = async (appointment) => {
    try {
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: appointment.email,
          subject: "Appointment Cancelled – Dr Rahul Ghuge's Dental clinic",
          text: `Dear ${appointment.name || "Patient"}`,
          html: APPOINTMENT_CANCELLED_EMAIL({
            patientName: appointment.name || "Patient",
            appointmentId: appointment.appointment_id || appointment.id,
            date: appointment.preferred_date,
            time: appointment.preferred_time,
            reason: "by the clinic",
          }),
        }),
      });

      if (response.ok) {
        toast.success("Cancellation email sent");
      }
    } catch (error) {
      console.error("Error sending cancellation email:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      const result = await fetch("/api/book-appointment", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          newStatus,
        }),
      });

      const resultData = await result.json();

      if (!result.ok) {
        toast.error(resultData.error || "Error while updating status");
        return;
      }

      const appointment = appointments.find((apt) => apt.id === id);

      if (newStatus === "Confirmed" && appointment) {
        await sendConfirmationEmail(appointment);
      } else if (newStatus === "Cancelled" && appointment) {
        await sendCancellationEmail(appointment);
      }

      setAppointments(
        appointments.map((apt) =>
          apt.id === id ? { ...apt, status: newStatus } : apt
        )
      );
      toast.success(`Status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Status change error:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const sendReminder = async (appId, name, date, time, email, at) => {
    try {
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: email,
          subject: "Appointment Reminder",
          text: "You have a dental appointment tomorrow.",
          html: `
          <div style="font-family: Arial, sans-serif; padding: 16px;">
            <h2 style="margin-bottom: 8px;">Dr Rahul Ghuge's Dental clinic</h2>
            <p>Hello <b>${name}</b>,</p>
            <p>This is a reminder for your dental appointment:</p>
            <p>
              <b>Date:</b> ${date}<br/>
              <b>Time:</b> ${time}<br/>
              <b>At:</b> Dr Rahul Ghuge's Dental clinic, ${at}
            </p>
            <p style="margin-top: 12px;">
              Please arrive 10 minutes early.
            </p>
            <p style="font-size: 12px; color: #666;">
              Appointment ID: ${appId}
            </p>
          </div>
        `,
        }),
      });

      if (!response.ok) throw new Error("Failed to send");
      toast.success("Reminder sent successfully");
    } catch (error) {
      toast.error("Failed to send reminder");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Completed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const renderActionButtons = (appointment) => {
    const status = appointment.status;

    return (
      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
        {status === "Pending" && (
          <button
            onClick={() => handleStatusChange(appointment.id, "Confirmed")}
            disabled={updatingId === appointment.id}
            className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors text-xs font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingId === appointment.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            Confirm
          </button>
        )}

        {status === "Confirmed" && (
          <button
            onClick={() => handleStatusChange(appointment.id, "Completed")}
            disabled={updatingId === appointment.id}
            className="inline-flex cursor-pointer items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingId === appointment.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
            Complete
          </button>
        )}

        {(status === "Pending" || status === "Confirmed") && (
          <Link
            href={`/book-appointment?name=${encodeURIComponent(appointment.name || "")}&phone=${encodeURIComponent(appointment.phone || "")}&email=${encodeURIComponent(appointment.email || "")}&date=${encodeURIComponent(appointment.preferred_date || "")}&time=${encodeURIComponent(appointment.preferred_time || "")}&service=${encodeURIComponent(appointment.service_name || "")}&at=${encodeURIComponent(appointment.at || "")}`}
            className="inline-flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 transition-colors text-xs font-medium shadow-sm"
          >
            <RefreshCw className="w-3 h-3" />
            Reschedule
          </Link>
        )}

        {status === "Completed" && (
          <button
            onClick={() => {
              router.push(`/upload-report?id=${appointment.appointment_id || appointment.id}`);
            }}
            className="inline-flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors text-xs font-medium shadow-sm"
          >
            <Upload className="w-3 h-3" />
            Upload Report
          </button>
        )}

        {status !== "Cancelled" && (
          <Link
            href={`tel:${appointment.phone}`}
            className="inline-flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-slate-700 text-white rounded-md hover:bg-slate-800 transition-colors text-xs font-medium shadow-sm"
          >
            <Phone className="w-3 h-3" />
            Call
          </Link>
        )}

        {(status === "Pending" || status === "Confirmed") && (
          <button
            onClick={() => handleStatusChange(appointment.id, "Cancelled")}
            disabled={updatingId === appointment.id}
            className="inline-flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors text-xs font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updatingId === appointment.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3 h-3" />}
            Cancel
          </button>
        )}

        {(status === "Pending" || status === "Confirmed") && appointment.email && (
          <button
            onClick={() =>
              sendReminder(
                appointment.appointment_id || appointment.id,
                appointment.name,
                appointment.preferred_date,
                appointment.preferred_time,
                appointment.email,
                appointment.at,
              )
            }
            className="inline-flex items-center cursor-pointer gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-xs font-medium shadow-sm"
          >
            <Bell className="w-3 h-3" />
            Remind
          </button>
        )}
      </div>
    );
  };

  const cleanDate = (dateStr) => {
      if (!dateStr) return "";
      // If date contains comma (default toLocaleString), take first part
      return dateStr.split(',')[0];
  };

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Appointments
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Manage patient bookings efficiently
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
             <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-md text-sm font-semibold">
                Total: {totalRecords}
             </div>
             <button 
                onClick={() => fetchAppointments()} 
                className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-md transition-colors"
                title="Refresh"
             >
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
             </button>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="relative">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="space-y-4">
             {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="h-1 bg-slate-100"></div>
                    <div className="p-5">
                        <div className="flex justify-between mb-4">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-slate-100 animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div>
                                    <div className="h-3 w-24 bg-slate-100 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse"></div>
                        </div>
                        <div className="h-20 bg-slate-50 rounded-lg border border-slate-100 animate-pulse"></div>
                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                             <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
                             <div className="h-8 w-20 bg-slate-100 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>
             ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
               <Calendar className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No appointments found
            </h3>
            <p className="text-slate-500 text-sm">
              Try adjusting your search or filters
            </p>
            <button 
                onClick={() => {
                  setSearch(''); 
                  setStatusFilter('All');
                  setDateFilter('');
                  setPage(1);
                }}
                className="mt-4 text-indigo-600 text-sm font-medium hover:underline cursor-pointer"
            >
                Clear all filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Left Highlight Bar */}
                  <div className={`w-full md:w-1.5 h-1 md:h-auto ${
                      appointment.status === 'Confirmed' ? 'bg-teal-500' :
                      appointment.status === 'Pending' ? 'bg-amber-500' :
                      appointment.status === 'Completed' ? 'bg-indigo-500' :
                      appointment.status === 'Cancelled' ? 'bg-rose-500' : 'bg-slate-300'
                  }`}></div>
                  
                  <div className="flex-1 p-5">
                     <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 font-bold text-lg">
                                {(appointment.name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">
                                    {appointment.name}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Phone size={14} /> {appointment.phone}
                                    </span>
                                    {appointment.email && (
                                        <span className="flex items-center gap-1">
                                            <Mail size={14} /> {appointment.email}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                             <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(appointment.status)}`}>
                                {appointment.status}
                             </div>
                             <span className="text-xs text-slate-400 font-mono">
                                #{appointment.appointment_id || appointment.id}
                             </span>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Service</p>
                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                <Stethoscope size={16} className="text-violet-500" />
                                {appointment.service_name}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Date & Time</p>
                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                <Calendar size={16} className="text-emerald-500" />
                                {cleanDate(appointment.preferred_date)} • {appointment.preferred_time}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Clinic</p>
                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                <Hospital size={16} className="text-blue-500" />
                                {appointment.at}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Created</p>
                            <div className="flex items-center gap-2 font-medium text-slate-700 text-sm">
                                <Clock size={16} className="text-slate-400" />
                                {new Date(appointment.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                     </div>

                     {renderActionButtons(appointment)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalRecords > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold">{Math.min((page - 1) * limit + 1, totalRecords)}</span> to <span className="font-semibold">{Math.min(page * limit, totalRecords)}</span> of <span className="font-semibold">{totalRecords}</span> results
                </p>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={20} className="text-slate-600" />
                    </button>
                    
                <div className="flex items-center gap-1">
                    {(() => {
                        const pages = [];
                        const maxVisiblePages = 5;
                        
                        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                        
                        if (endPage - startPage + 1 < maxVisiblePages) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        // Always show first page
                        if (startPage > 1) {
                            pages.push(
                                <button
                                    key="1"
                                    onClick={() => setPage(1)}
                                    className="w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                >
                                    1
                                </button>
                            );
                            if (startPage > 2) {
                                pages.push(<span key="dots-start" className="px-1 text-slate-400">...</span>);
                            }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                            pages.push(
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                        page === i 
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200" 
                                        : "text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                    }`}
                                >
                                    {i}
                                </button>
                            );
                        }

                        // Always show last page
                        if (endPage < totalPages) {
                            if (endPage < totalPages - 1) {
                                pages.push(<span key="dots-end" className="px-1 text-slate-400">...</span>);
                            }
                            pages.push(
                                <button
                                    key={totalPages}
                                    onClick={() => setPage(totalPages)}
                                    className="w-9 h-9 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200"
                                >
                                    {totalPages}
                                </button>
                            );
                        }
                        
                        return pages;
                    })()}
                </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={20} className="text-slate-600" />
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsContent;