"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Clock, CheckCircle, ChevronRight, ChevronLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AppointmentWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    reason: "",
    date: "",
    slot: "",
    name: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/dental-services')
        .then(res => res.json())
        .then(data => {
            if (data.services) setServices(data.services);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
            toast.error("Failed to load services. Please refresh the page.");
        });
  }, []);

  const steps = [
    { id: 1, title: "Service", icon: <CheckCircle className="w-5 h-5" /> },
    { id: 2, title: "Date & Time", icon: <Calendar className="w-5 h-5" /> },
    { id: 3, title: "Details", icon: <User className="w-5 h-5" /> },
  ];

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

  const validateStep = (currentStep) => {
    const newErrors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.service) {
        newErrors.service = "Please select a service to proceed.";
        isValid = false;
        toast.error("Please select a service to continue.");
      }
    } else if (currentStep === 2) {
      if (!formData.date) {
        newErrors.date = "Please select a preferred date.";
        isValid = false;
      }
      if (!formData.slot) {
        newErrors.slot = "Please select a time slot.";
        isValid = false;
      }
      if (!isValid) toast.error("Please select both date and time.");
    } else if (currentStep === 3) {
      if (!formData.name.trim()) {
        newErrors.name = "Full Name is required.";
        isValid = false;
      }
      
      const phoneRegex = /^[0-9]{10}$/;
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required.";
        isValid = false;
      } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = "Please enter a valid 10-digit phone number.";
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email || !formData.email.trim()) {
        newErrors.email = "Email address is required.";
        isValid = false;
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address.";
        isValid = false;
      }

      if (!isValid) toast.error("Please fix the errors in the form.");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 3) {
        setStep(step + 1);
        setErrors({}); 
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const loadingToast = toast.loading("Booking your appointment...");
    
    try {
        const payload = {
            patient_name: formData.name,
            phone: formData.phone,
            email: formData.email,
            service: formData.service,
            appointment_date: formData.date,
            appointment_time: formData.slot,
            clinic: "Main Clinic",
            notes: formData.reason
        };

        const res = await fetch('/api/book-appointment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            toast.dismiss(loadingToast);
            toast.success("Appointment booked successfully!", {
                duration: 5000,
                description: "We have sent a confirmation to your phone."
            });
            setIsCompleted(true);
        } else {
            toast.dismiss(loadingToast);
            const errorData = await res.json().catch(() => ({}));
            toast.error(errorData.message || "Failed to book appointment. Please try again.");
        }
    } catch (error) {
        toast.dismiss(loadingToast);
        console.error("Booking error", error);
        toast.error("An unexpected error occurred. Please try again later.");
    } finally {
        setSubmitting(false);
    }
  };

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Step Content Renderers
  const renderStep1 = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-900 mb-4">What do you need help with?</h3>
        {loading ? <div className="text-center py-4 text-cyan-600">Loading services...</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {services.slice(0, 8).map((service) => (
                <div 
                    key={service.id || service.$id}
                    onClick={() => updateData("service", service.name)}
                    className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                        formData.service === service.name 
                        ? "bg-cyan-50 border-cyan-500 ring-1 ring-cyan-500" 
                        : "bg-white border-gray-200 hover:border-cyan-300"
                    }`}
                >
                    <p className="font-semibold text-gray-800">{service.name}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{service.description}</p>
                </div>
            ))}
             <div 
                    onClick={() => updateData("service", "General Checkup")}
                    className={`p-4 rounded-xl border cursor-pointer hover:shadow-md transition-all ${
                        formData.service === "General Checkup" 
                        ? "bg-cyan-50 border-cyan-500 ring-1 ring-cyan-500" 
                        : "bg-white border-gray-200 hover:border-cyan-300"
                    }`}
                >
                    <p className="font-semibold text-gray-800">General Checkup</p>
                    <p className="text-xs text-gray-500 mt-1">Routine cleaning and examination</p>
                </div>
        </div>
        )}
        {errors.service && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {errors.service}
            </p>
        )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Select a Date</h3>
            <input 
                type="date" 
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-colors ${
                    errors.date ? "border-red-500 focus:border-red-500" : "border-gray-300"
                }`}
                onChange={(e) => updateData("date", e.target.value)}
                value={formData.date}
            />
            {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>
        <div>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Preferred Time</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {timeSlots.map(slot => (
                    <button
                        key={slot}
                        onClick={() => updateData("slot", slot)}
                        className={`py-2 px-1 text-sm rounded-lg border transition-all ${
                            formData.slot === slot
                            ? "bg-blue-900 text-white border-blue-900"
                            : "bg-white text-gray-600 border-gray-200 hover:border-cyan-400"
                        }`}
                    >
                        {slot}
                    </button>
                ))}
            </div>
            {errors.slot && <p className="text-red-500 text-sm mt-1">{errors.slot}</p>}
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Your Contact Details</h3>
        <div className="space-y-3">
            <div>
                <input 
                    type="text" 
                    placeholder="Full Name *" 
                    className={`w-full p-4 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all ${
                        errors.name ? "border-red-500 ring-1 ring-red-500 bg-red-50" : "border-gray-200"
                    }`}
                    value={formData.name}
                    onChange={(e) => updateData("name", e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 ml-1">{errors.name}</p>}
            </div>
            
            <div>
                <input 
                    type="tel" 
                    placeholder="Phone Number *" 
                    className={`w-full p-4 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all ${
                        errors.phone ? "border-red-500 ring-1 ring-red-500 bg-red-50" : "border-gray-200"
                    }`}
                    value={formData.phone}
                    onChange={(e) => updateData("phone", e.target.value)}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1 ml-1">{errors.phone}</p>}
            </div>

            <div>
                <input 
                    type="email" 
                    placeholder="Email Address *" 
                    className={`w-full p-4 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all ${
                        errors.email ? "border-red-500 ring-1 ring-red-500 bg-red-50" : "border-gray-200"
                    }`}
                    value={formData.email}
                    onChange={(e) => updateData("email", e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1 ml-1">{errors.email}</p>}
            </div>

            <textarea 
                placeholder="Any special notes? (Optional)" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none h-24"
                value={formData.reason}
                onChange={(e) => updateData("reason", e.target.value)}
            ></textarea>
        </div>
    </div>
  );

  if (isCompleted) {
    return (
        <section className="w-full py-20 bg-gray-50">
            <div className="max-w-xl mx-auto px-6">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600 mb-8">
                        Thank you, <span className="font-semibold">{formData.name}</span>. Your appointment for <span className="font-semibold">{formData.service}</span> is set for {formData.date} at {formData.slot}.
                    </p>
                    <button 
                        onClick={() => { setIsCompleted(false); setStep(1); setFormData({ service: "", reason: "", date: "", slot: "", name: "", phone: "", email: "" }); setErrors({}); }}
                        className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-800 transition-colors"
                    >
                        Book Another
                    </button>
                </motion.div>
            </div>
        </section>
    );
  }

  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4 font-serif">Book an Appointment</h2>
            <p className="text-gray-600">Schedule your visit in 3 simple steps</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 flex flex-col md:flex-row min-h-[500px]">
            {/* Sidebar / Progress */}
            <div className="bg-blue-900 text-white p-8 md:w-1/3 flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-bold mb-8 opacity-90">Booking Progress</h3>
                    <div className="space-y-6">
                        {steps.map((s, idx) => (
                            <div key={s.id} className={`flex items-center gap-4 ${step >= s.id ? "opacity-100" : "opacity-40"}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                    step >= s.id ? "bg-cyan-500 border-cyan-500" : "border-white/30"
                                }`}>
                                    <span className="font-bold">{s.id}</span>
                                </div>
                                <span className="font-medium tracking-wide">{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="hidden md:block">
                    <p className="text-xs text-blue-300 opacity-70">Need help? Call us at</p>
                    <p className="text-xl font-bold mt-1 tracking-wider">+91 98765 43210</p>
                </div>
            </div>

            {/* Form Area */}
            <div className="p-8 md:p-12 flex-1 flex flex-col">
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {step === 1 && renderStep1()}
                            {step === 2 && renderStep2()}
                            {step === 3 && renderStep3()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex justify-between pt-8 border-t border-gray-100 mt-8">
                    <button 
                        onClick={handleBack}
                        disabled={step === 1}
                        className={`flex items-center gap-2 text-gray-500 font-semibold transition-opacity ${step === 1 ? "opacity-0 pointer-events-none" : "hover:text-gray-800"}`}
                    >
                         <ChevronLeft className="w-5 h-5" /> Back
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        disabled={submitting}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         {submitting ? "Processing..." : (step === 3 ? "Confirm Booking" : "Next Step")} <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
