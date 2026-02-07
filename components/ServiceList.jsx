"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Shield, 
  Star, 
  ChevronRight,
  CheckCircle,
  XCircle
} from "lucide-react";

export default function ServiceList({ services }) {
  // Limit to maximum 9 services
  const displayServices = services.slice(0, 9);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 100,
        damping: 15
      } 
    }
  };

  // Function to get service duration based on name/category
  const getServiceDuration = (name) => {
    const durations = {
      'cleaning': '30-45 mins',
      'whitening': '60 mins',
      'implant': '90-120 mins',
      'extraction': '30-60 mins',
      'filling': '30-45 mins',
      'root canal': '60-90 mins',
      'braces': '60 mins',
      'checkup': '30 mins',
      'cosmetic': '60-90 mins',
      'emergency': '30-60 mins'
    };
    
    const serviceName = name.toLowerCase();
    for (const [key, duration] of Object.entries(durations)) {
      if (serviceName.includes(key)) {
        return duration;
      }
    }
    return '45-60 mins';
  };

  // Function to validate image URL
  const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    const cleanUrl = url.trim();
    if (cleanUrl === '') return false;
    
    try {
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        new URL(cleanUrl);
        return true;
      }
      if (cleanUrl.startsWith('/')) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Function to get category color
  const getCategoryColor = (name) => {
    const colors = {
      'cleaning': 'bg-blue-50 text-blue-700 border-blue-200',
      'whitening': 'bg-purple-50 text-purple-700 border-purple-200',
      'implant': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'extraction': 'bg-amber-50 text-amber-700 border-amber-200',
      'filling': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'root canal': 'bg-red-50 text-red-700 border-red-200',
      'braces': 'bg-pink-50 text-pink-700 border-pink-200',
      'checkup': 'bg-green-50 text-green-700 border-green-200',
      'cosmetic': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'emergency': 'bg-orange-50 text-orange-700 border-orange-200'
    };
    
    const serviceName = name.toLowerCase();
    for (const [key, color] of Object.entries(colors)) {
      if (serviceName.includes(key)) {
        return color;
      }
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // If no services, show empty state
  if (!displayServices || displayServices.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
        <p className="text-gray-600">Please check back later</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
     

      {/* Services Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      >
        {displayServices.map((service, index) => {
          const duration = getServiceDuration(service.name);
          const categoryColor = getCategoryColor(service.name);
          const hasValidImage = isValidImageUrl(service.image_url);
          
          return (
            <motion.div
              key={service.id || index}
              variants={item}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative w-full h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                {hasValidImage ? (
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                            <div class="text-center">
                            <div class="text-5xl mb-3">🦷</div>
                            <p class="text-blue-500 font-medium text-sm">${service.name}</p>
                          </div>
                        </div>
                      `;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-5xl mb-3">🦷</div>
                      <p className="text-blue-500 font-medium text-sm">{service.name}</p>
                    </div>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                    service.is_active
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    {service.is_active ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Available
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        Coming Soon
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {service.name}
                </h3>

                {/* Service Details */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4" />
                    Painless
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                  {service.description || "Professional dental treatment with modern equipment and experienced specialists."}
                </p>

                {/* Action Button */}
                <Link
                  href={`/book-appointment?service=${encodeURIComponent(service.name)}`}
                  className="block w-full"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!service.is_active}
                    className={`w-full flex items-center justify-center gap-2 ${
                      service.is_active
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    } px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}
                  >
                    {service.is_active ? (
                      <>
                        <Calendar className="w-4 h-4" />
                        Book Appointment
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    ) : (
                      'Not Available'
                    )}
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* View All Button (if more than 9 services) */}
      {services.length > 9 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-8 py-3.5 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-semibold group"
          >
            View All {services.length} Services
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-gray-500 mt-3">
            Plus {services.length - 9} more specialized treatments
          </p>
        </motion.div>
      )}

    

     
    </div>
  );
}