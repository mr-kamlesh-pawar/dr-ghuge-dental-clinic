"use client";

import Image from "next/image";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section id="home" className="mt-20 relative min-h-screen flex items-center bg-white text-slate-900 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/hero-2.jpeg"
          alt="Modern hospital building"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/95 to-white/20 lg:bg-gradient-to-r lg:via-white/90" />
      </div>
      
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute top-4 right-4 md:top-8 md:right-8 bg-red-600 text-white px-4 py-2 md:px-6 md:py-4 rounded-lg shadow-xl font-semibold text-sm md:text-lg z-10 animate-bounce"
      >
        <a href="tel:+917972933329" className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 md:w-6 md:h-6" />
          <span>Emergency? Call: +91 7972933329</span>
        </a>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-serif text-slate-900"
            >
              Smile Brighter,
              <br />
              <span className="text-indigo-500"> Live Healthier </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              Comprehensive dental care at Dr Rahul Ghuge's Dental Clinic, combining
              advanced treatments, gentle hands, and a commitment to lifelong
              oral health.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 pt-4 justify-center lg:justify-start"
            >
              <Link
                href="/book-appointment"
                className="w-full sm:w-auto inline-block bg-blue-600 text-white font-semibold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Book an Appointment
              </Link>
              <Link
                href="/appointment-status"
                className="w-full sm:w-auto inline-block bg-white border-2 border-slate-200 text-slate-700 font-semibold text-base md:text-lg px-6 py-3 md:px-8 md:py-4 rounded-lg hover:border-blue-600 hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Check Status/Report
              </Link>
            </motion.div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 mt-8 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2"
            >
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <Image
                  src="/image.png"
                  alt="Doctors and nurses caring for a patient"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className="relative h-32 sm:h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <Image
                src="/hero-1.jpeg"
                alt="Advanced hybrid operating room"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="relative h-32 sm:h-48 md:h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
            >
              <Image
                src="/hero-4.jpg"
                alt="Modern MRI scanner"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
