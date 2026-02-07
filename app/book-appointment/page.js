"use client";

import AppointMentSuccessCard from "@/components/AppointmentSuccessPage";
import {
  APPOINTMENT_RESCHEDULED_EMAIL,
  BOOKING_CONFIRMATION_EMAIL,
} from "@/model/emailTemplates";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import { toast } from "sonner";

const AppointmentFormContent = () => {
  const searchParams = useSearchParams();
  const params = useSearchParams();
  const router = useRouter();
  const query = {
    name: params.get("name"),
    phone: params.get("phone"),
    email: params.get("email"),
    date: params.get("date"),
    time: params.get("time"),
    service: params.get("service"),
    at: params.get("at"),
    note: params.get("name") ? "Resheduled Your Appointment" : "",
  };

  const is_resheduled = query.name && query.email && query.phone;
  const rawDate = query.date || "";

  const appointment_date = rawDate
    ? new Date(rawDate).toISOString().split("T")[0]
    : "";

  const [categories, setCategories] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [isLoading, setLoding] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    patient_name: query.name || "",
    phone: query.phone || "",
    email: query.email || "",
    service: query.service || "",
    appointment_date: appointment_date || "",
    appointment_time: query.time || "",
    notes: query.note || "",
    clinic: query.at || "",
  });

  // Fetch services
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/dental-services", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.services);
        } else {
          toast.error("Failed to load services");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error loading services");
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const serviceFromUrl = searchParams.get("service");
    if (serviceFromUrl) {
      setFormData((prev) => ({
        ...prev,
        service: decodeURIComponent(serviceFromUrl),
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.patient_name.trim()) {
      newErrors.patient_name = "Patient Name is required";
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Enter a valid 10-digit phone number";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !formData.email.trim()) {
      // Email optional Check
    } else if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      isValid = false;
    }

    if (!formData.service) {
      newErrors.service = "Please select a service";
      isValid = false;
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = "Date is required";
      isValid = false;
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = "Time is required";
      isValid = false;
    }

    if (!formData.clinic) {
      newErrors.clinic = "Please select a clinic location";
      isValid = false;
    }

    setErrors(newErrors);

    // Show first error in toast for better UX
    if (!isValid) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError || "Please check the form for errors");
    }

    return isValid;
  };

  const sendConfirmationEmail = async (appointment) => {
    if (!appointment?.email) {
      console.warn("No email found for appointment → skipping email");
      return;
    }

    try {
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: appointment.email,
          subject: is_resheduled
            ? "Your Appointment Has Been Rescheduled – Aabha Dental Clinic"
            : "Your Appointment is Confirmed – Aabha Dental Clinic",
          text: `Dear ${appointment.patient_name || "Patient"}`,
          html: is_resheduled
            ? APPOINTMENT_RESCHEDULED_EMAIL({
                patientName: appointment.name || "Patient",
                appointmentId: appointment.appointment_id,
                oldDate: query.date,
                oldTime: query.time,
                oldService: query.service,
                newDate: appointment.preferred_date,
                newTime: appointment.preferred_time,
                newService: appointment.service_name || "General Dental",
                clinic: appointment.at || "Aabha Dental Clinic",
              })
            : BOOKING_CONFIRMATION_EMAIL({
                patientName: appointment.name || "Patient",
                appointmentId: appointment.appointment_id,
                date: appointment.preferred_date,
                time: appointment.preferred_time,
                service: appointment.service_name || "General Dental",
                clinic: appointment.at || "Aabha Dental Clinic",
              }),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoding(true);
    const loadingToast = toast.loading("Booking appointment...");

    try {
      const result = await fetch("/api/book-appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (result.ok) {
        const data = await result.json();
        const appointment = data.data; // API returns { data: { ...appointment } }

        setAppointmentData({
          id: appointment.id,
          name: formData.patient_name,
          clinic: formData.clinic,
          date: formData.appointment_date,
        });

        await sendConfirmationEmail(appointment);
        
        toast.dismiss(loadingToast);
        toast.success("Appointment booked successfully!");

        if (is_resheduled) {
          router.push("/admin-panel");
        } else {
          setShowSuccess(true);
        }

        setFormData({
          patient_name: "",
          phone: "",
          email: "",
          service: "",
          appointment_date: "",
          appointment_time: "",
          notes: "",
          clinic: "",
        });
        setErrors({});
      } else {
        toast.dismiss(loadingToast);
        const errorData = await result.json().catch(() => ({}));
        // Use the specific error message from the server if available
        const errorMessage = errorData.error || errorData.message || "Failed to book appointment";
        toast.error(errorMessage);
        
        // If there are field-specific errors from server, we could map them to state
        if (errorData.errors && Array.isArray(errorData.errors)) {
           // Optional: you could try to map server errors to fields if the format matches
           console.log("Server validation errors:", errorData.errors);
        }
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.dismiss(loadingToast);
      toast.error("An unexpected error occurred");
    } finally {
      setLoding(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (showSuccess && appointmentData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <AppointMentSuccessCard
          id={appointmentData.id}
          name={appointmentData.name}
          clinic={appointmentData.clinic}
          date={appointmentData.date}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-2xl font-bold text-white">
              Book an Appointment
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="patient_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Patient Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="patient_name"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                    errors.patient_name
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Abhishek Jadhav"
                />
                {errors.patient_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.patient_name}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                    errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="+91 00000 00000"
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                    errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="patient@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Service <span className="text-red-500">*</span>
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                    errors.service
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option className="cursor-pointer" value="">
                    Select a service
                  </option>
                  {categories.map((service) => (
                    <option
                      className="font-semibold cursor-pointer"
                      key={service.id}
                      value={service.name}
                    >
                      {service.name}
                    </option>
                  ))}
                </select>
                {errors.service && (
                  <p className="text-red-500 text-xs mt-1">{errors.service}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="appointment_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Appointment Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="appointment_date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleChange}
                  required
                  min={today}
                  className={`w-full px-4 py-2 border rounded-lg  focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                    errors.appointment_date
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.appointment_date && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.appointment_date}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="appointment_time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Appointment Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="appointment_time"
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                    errors.appointment_time
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.appointment_time && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.appointment_time}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="clinic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Center <span className="text-red-500">*</span>
              </label>
              <select
                id="clinic"
                name="clinic"
                value={formData.clinic}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition ${
                  errors.clinic ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              >
                <option value="">Select Clinic</option>
                <option value="Bedag">Bedag</option>
                <option value="Miraj">Miraj</option>
              </select>
              {errors.clinic && (
                <p className="text-red-500 text-xs mt-1">{errors.clinic}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Any special requests or medical information..."
              />
            </div>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">
                Important Notes & Clinic Timings
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Clinic remains closed every Sunday.</li>
                <li>
                  Miraj Clinic Timings: <strong>9:00 AM – 2:00 PM</strong>{" "}
                  (Monday to Saturday)
                </li>
                <li>
                  Bedag Clinic Timings: <strong>4:00 PM – 9:00 PM</strong>{" "}
                  (Monday to Saturday)
                </li>
                <li>Appointment fees must be paid directly at the clinic.</li>
                <li>Please arrive 10 minutes before your scheduled time.</li>
                <li>Carry a valid ID and previous medical reports (if any).</li>
                <li>
                  Cancellations should be made at least 24 hours in advance.
                </li>
                <li>
                  An automatic email reminder will be sent 2 hours before your
                  appointment.
                </li>
              </ul>
            </div>

            <div className="flex items-start gap-2">
              <input
                id="confirmation"
                name="confirmation"
                type="checkbox"
                required
                className="mt-1"
              />
              <label htmlFor="confirmation" className="text-sm text-gray-700">
                I agree to the{" "}
                <span className="font-medium text-cyan-600">
                  terms and conditions
                </span>{" "}
                and confirm that the information provided is accurate.
              </label>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Booking Appointment..." : "Book Appointment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AppointmentForm = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <AppointmentFormContent />
    </Suspense>
  );
};

export default AppointmentForm;
