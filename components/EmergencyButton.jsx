"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, AlertTriangle, X } from "lucide-react";

export default function EmergencyButton() {
  const [isOpen, setIsOpen] = useState(false);

  // Pulse animation for the button
  const pulse = {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 0 0 rgba(239, 68, 68, 0.7)",
      "0 0 0 10px rgba(239, 68, 68, 0)",
      "0 0 0 0 rgba(239, 68, 68, 0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <>
      <motion.button
        animate={pulse}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-red-600 text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-red-700 transition-colors focus:outline-none group"
        title="Emergency Dental Care"
      >
        <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 fill-current" />
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Emergency?
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 md:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal */}
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl mx-auto overflow-hidden text-center p-8"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="w-10 h-10 text-red-600 animate-bounce" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-2">Emergency Assistance</h3>
              <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                Severe toothache? Trauma? Don't wait. Our specialists are available 24/7 for urgent dental care.
              </p>

              <a 
                href="tel:+919876543210" 
                className="block w-full bg-red-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-red-500/30 hover:bg-red-700 transform active:scale-95 transition-all mb-4"
              >
                Call Now: +91 98765 43210
              </a>
              
              <p className="text-xs text-gray-400">
                Wait time is usually less than 20 minutes for emergencies.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
