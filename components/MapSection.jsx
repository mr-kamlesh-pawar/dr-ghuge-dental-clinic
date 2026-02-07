"use client";

import { motion } from "framer-motion";

export default function MapSection() {
  return (
    <section className="w-full py-20 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 font-serif"
          >
            Visit Our Clinic
          </motion.h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conveniently located near Akurdi Railway Station, creating smiles across Pune.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
        >
          {/* Custom Overlay for 'Premium' feel before interaction could go here, but map needs to be interactive */}
          
          <iframe 
            src="https://maps.google.com/maps?width=661&amp;height=400&amp;hl=en&amp;q=dr rahul ghuge akurdi&amp;t=p&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(20%) contrast(1.2) opacity(0.9)" }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full"
            title="Dr. Ghuge Dental Clinic Location"
          ></iframe>

          {/* Floating Location Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute top-8 left-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl max-w-xs hidden md:block border border-gray-100"
          >
            <h3 className="text-xl font-bold text-blue-900 mb-2">Dr. Ghuge's Dental Clinic</h3>
            <p className="text-gray-600 text-sm mb-4">
              Near Akurdi Railway Station,<br />
              Pimpri-Chinchwad, Pune,<br />
              Maharashtra 411035
            </p>
            <a 
              href="https://maps.app.goo.gl/ffwDvHRsn2Fen8rZA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-600 font-semibold text-sm hover:underline"
            >
              Get Directions &rarr;
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>
    </section>
  );
}
