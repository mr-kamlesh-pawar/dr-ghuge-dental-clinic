"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQComponent() {
  const [openId, setOpenId] = useState(null);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dental-faqs')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) setFaqs(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to fetch FAQs", err);
            setLoading(false);
        });
  }, []);

  const toggleFAQ = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-20 relative z-10 -mt-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-6 font-serif">
          Frequently Asked Questions
        </h2>
        <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full mb-6"></div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Everything you need to know about our services, appointments, and oral health care.
        </p>
      </div>
      
      {loading ? <div className="text-center">Loading FAQs...</div> : (
      <div className="space-y-4">
        {faqs.map((item) => (
          <motion.div
            key={item.id || item.$id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (item.display_order || 1) * 0.1 }}
            className={`bg-white rounded-2xl overflow-hidden border transition-all duration-300 ${
              openId === (item.id || item.$id)
                ? "border-cyan-500 shadow-lg"
                : "border-gray-200 hover:border-cyan-300 hover:shadow-md"
            }`}
          >
            <button
              onClick={() => toggleFAQ(item.id || item.$id)}
              className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none bg-white"
            >
              <span
                className={`text-lg md:text-xl font-bold transition-colors duration-300 ${
                  openId === (item.id || item.$id) ? "text-cyan-600" : "text-gray-800"
                }`}
              >
                {item.question}
              </span>
              <div
                className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                  openId === (item.id || item.$id)
                    ? "bg-cyan-100 text-cyan-600 rotate-180"
                    : "bg-gray-100 text-gray-500 group-hover:bg-cyan-50 group-hover:text-cyan-600"
                }`}
              >
                {openId === (item.id || item.$id) ? (
                  <Minus className="w-5 h-5" />
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </div>
            </button>

            <AnimatePresence>
              {openId === (item.id || item.$id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6 md:p-8 pt-0 text-gray-600 text-base md:text-lg leading-relaxed border-t border-gray-100 bg-gray-50/50">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      )}
    </div>
  );
}

