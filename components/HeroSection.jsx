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
        <div className="absolute inset-0 bg-linear-to-r from-white via-white/90 to-white/20" />
      </div>
      
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute top-8 right-8 bg-red-600 text-white px-6 py-4 rounded-lg shadow-xl font-semibold text-lg z-10 animate-bounce"
      >
        <a href="tel:12345678901" className="flex items-center gap-2">
          <ShieldAlert />
          Emergency? Call: 123 4567 8901
        </a>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-serif text-slate-900"
            >
              Smile Brighter,
              <br />
              <span className="text-indigo-500"> Live Healthier </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-slate-600 max-w-2xl leading-relaxed"
            >
              Comprehensive dental care at Dr Rahul Ghuge's Dental Clinic, combining
              advanced treatments, gentle hands, and a commitment to lifelong
              oral health.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-6 pt-4"
            >
              <Link
                href="/book-appointment"
                className="inline-block bg-blue-600 text-white font-semibold text-md px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-center"
              >
                Book an Appointment
              </Link>
              <Link
                href="/appointment-status"
                className="inline-block bg-white border-2 border-slate-200 text-slate-700 font-semibold text-md px-8 py-4 rounded-lg hover:border-blue-600 hover:-translate-y-1  transition-all duration-300 text-center"
              >
                Check Appointment Status/ Report
              </Link>
            </motion.div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="col-span-2"
            >
              <div className="relative h-80 md:h-100 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
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
               className="relative h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
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
               className="relative h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-white"
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
