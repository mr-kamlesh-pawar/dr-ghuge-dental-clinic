"use client";

import { useState, useEffect } from "react";
import ServiceList from "./ServiceList";

export default function ServiceCard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/dental-services');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch services: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success === false) {
          throw new Error(data.error || "Failed to load services");
        }
        
        // Limit to maximum 9 services
        const limitedServices = data.services 
          ? data.services.slice(0, 9)
          : data.data 
            ? data.data.slice(0, 9)
            : [];
            
        setServices(limitedServices);
      } catch (err) {
        console.error("Failed to fetch services", err);
        setError(err.message);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Loading Skeleton Component
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-10 w-64 bg-gray-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded mx-auto animate-pulse"></div>
        </div>
        
        {/* Services Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(9)].map((_, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-pulse"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Skeleton */}
              <div className="w-full h-48 bg-gray-200"></div>
              
              <div className="p-6">
                {/* Title & Category Skeleton */}
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-2">
                    <div className="h-6 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                </div>
                
                {/* Description Skeleton */}
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
                
                {/* Button Skeleton */}
                <div className="h-10 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* View All Skeleton */}
        <div className="text-center mt-10">
          <div className="h-10 w-40 bg-gray-200 rounded-lg mx-auto animate-pulse"></div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Failed to Load Services</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!loading && services.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Services Available</h3>
          <p className="text-gray-600">Check back soon for our dental services</p>
        </div>
      </div>
    );
  }

  return <ServiceList services={services} />;
}