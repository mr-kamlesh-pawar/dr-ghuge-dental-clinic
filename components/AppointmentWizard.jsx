"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, Clock, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { mockServices } from "@/lib/mockData";

export default function AppointmentWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    reason: "",
    date: "",
    slot: "",
    name: "",
    phone: "",
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const steps = [
    { id: 1, title: "Service", icon: <CheckCircle className="w-5 h-5" /> },
    { id: 2, title: "Date & Time", icon: <Calendar className="w-5 h-5" /> },
    { id: 3, title: "Details", icon: <User className="w-5 h-5" /> },
  ];

  const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // Simulate API call
    setTimeout(() => {
        setIsCompleted(true);
    }, 1000);
  };

  const updateData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Step Content Renderers
  const renderStep1 = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-900 mb-4">What do you need help with?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {mockServices.slice(0, 6).map((service) => (
                <div 
                    key={service.id}
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
        <div>
            <h3 className="text-xl font-bold text-blue-900 mb-4">Select a Date</h3>
            <input 
                type="date" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none"
                onChange={(e) => updateData("date", e.target.value)}
                value={formData.date}
            />
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
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold text-blue-900 mb-4">Your Contact Details</h3>
        <div className="space-y-3">
            <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => updateData("name", e.target.value)}
            />
             <input 
                type="tel" 
                placeholder="Phone Number" 
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => updateData("phone", e.target.value)}
            />
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
                        onClick={() => { setIsCompleted(false); setStep(1); setFormData({ service: "", reason: "", date: "", slot: "", name: "", phone: "" }); }}
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
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-cyan-500/30 transition-all flex items-center gap-2"
                        disabled={
                            (step === 1 && !formData.service) ||
                            (step === 2 && (!formData.date || !formData.slot)) ||
                            (step === 3 && !formData.name)
                        }
                    >
                         {step === 3 ? "Confirm Booking" : "Next Step"} <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
