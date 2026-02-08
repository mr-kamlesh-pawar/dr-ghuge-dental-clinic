"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import Image from "next/image";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  
  const phoneNumber = "917972933329"; // Updated to clinic number
  
  const suggestedQueries = [
    "I want to book an appointment",
    "I have a dental emergency",
    "What are your opening hours?",
    "Cost inquiry for treatment",
    "Address of the clinic?"
  ];

  const handleSend = () => {
    const text = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${text}`, "_blank");
    setIsOpen(false);
    setMessage("");
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  // Pulse animation for the button
  const pulse = {
    scale: [1, 1.1, 1],
    boxShadow: [
      "0 0 0 0 rgba(37, 211, 102, 0.7)",
      "0 0 0 10px rgba(37, 211, 102, 0)",
      "0 0 0 0 rgba(37, 211, 102, 0)"
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
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl hover:bg-[#20bd5a] transition-colors focus:outline-none group"
        title="Chat on WhatsApp"
      >
        <MessageCircle className="w-8 h-8 md:w-10 md:h-10 fill-current" />
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat with us
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
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl mx-auto overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#075E54] p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                   <div className="relative w-10 h-10 rounded-full overflow-hidden bg-white/20">
                      {/* Placeholder for clinic logo or doctor image if available, else icon */}
                      <MessageCircle className="w-full h-full p-2" />
                   </div>
                   <div>
                      <h3 className="font-bold text-sm md:text-base">Dr. Ghuge's Dental Clinic</h3>
                      <p className="text-xs text-green-100 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                        Typically replies instantly
                      </p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Body */}
              <div className="p-4 bg-[#E5DDD5] min-h-[300px] max-h-[60vh] overflow-y-auto flex flex-col gap-3">
                 {/* Auto-greeting */}
                 <div className="self-start bg-white rounded-lg rounded-tl-none p-3 shadow-sm max-w-[85%] text-sm text-gray-800">
                    Hello! 👋 <br/>How can we help you with your dental needs today?
                    <span className="text-[10px] text-gray-500 block text-right mt-1">
                      {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                 </div>

                 {/* Display connection text */}
                 <div className="text-center my-2">
                    <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-1 rounded-full shadow-sm">
                       Messages are secured with end-to-end encryption.
                    </span>
                 </div>

                 {/* Suggested Queries */}
                 <div className="mt-auto pt-4">
                    <p className="text-xs text-gray-500 mb-2 font-medium ml-1">Suggested:</p>
                    <div className="flex flex-wrap gap-2">
                       {suggestedQueries.map((query, index) => (
                          <button
                            key={index}
                            onClick={() => handleSuggestionClick(query)}
                            className="text-xs bg-white border border-gray-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm active:scale-95"
                          >
                             {query}
                          </button>
                       ))}
                    </div>
                 </div>
              </div>

              {/* Input Area */}
              <div className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2 items-center">
                 <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border-none bg-white rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-[#25D366] shadow-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 />
                 <button
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`p-2 rounded-full shadow-sm transition-all ${
                       message.trim() 
                         ? "bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-105" 
                         : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                 >
                    <Send className="w-5 h-5 ml-0.5" /> 
                    {/* ml-0.5 to visually center the icon better */}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
