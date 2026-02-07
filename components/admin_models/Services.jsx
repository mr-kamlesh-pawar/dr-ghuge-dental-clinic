"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Save, X, Ban, CircleCheckBig, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const Services = () => {
  const [services, setServices] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    image_url: "",
    is_active: true,
  });

  // Function to validate image URL
  const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    
    // Clean the URL
    const cleanUrl = url.trim();
    if (cleanUrl === '') return false;
    
    // Check if it's a valid URL format
    try {
      // Check if it starts with http:// or https://
      if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
        new URL(cleanUrl);
        return true;
      }
      
      // Check if it's a relative path
      if (cleanUrl.startsWith('/')) {
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  // Function to get safe image URL
  const getSafeImageUrl = (url) => {
    if (isValidImageUrl(url)) {
      return url;
    }
    return null; // Return null for invalid URLs
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log("Fetching services...");
        const res = await fetch("/api/dental-services", {
          cache: "no-store",
        });

        console.log("Response status:", res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error("Response error:", errorText);
          throw new Error(`Failed to fetch services: ${res.status}`);
        }

        const data = await res.json();
        console.log("API Response data:", data);
        
        // Check the structure - it might be data.data or data.services
        if (data.success === false) {
          console.error("API returned error:", data.error);
          toast.error(data.error || "Failed to load services");
          setServices([]);
        } else if (data.services) {
          console.log("Services found:", data.services.length);
          // Clean up image URLs before setting
          const cleanedServices = data.services.map(service => ({
            ...service,
            image_url: getSafeImageUrl(service.image_url)
          }));
          setServices(cleanedServices);
        } else if (data.data) {
          console.log("Data found in data.data:", data.data.length);
          const cleanedServices = data.data.map(service => ({
            ...service,
            image_url: getSafeImageUrl(service.image_url)
          }));
          setServices(cleanedServices);
        } else if (Array.isArray(data)) {
          console.log("Data is array:", data.length);
          const cleanedServices = data.map(service => ({
            ...service,
            image_url: getSafeImageUrl(service.image_url)
          }));
          setServices(cleanedServices);
        } else {
          console.log("No services found in response");
          setServices([]);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
        setServices([]);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : 
              name === "is_active" ? value === "true" : 
              value,
    }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    console.log("Adding service with data:", formData);
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/dental-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image_url: isValidImageUrl(formData.image_url) ? formData.image_url : "",
          is_active: formData.is_active,
          display_order: services.length + 1,
        }),
      });

      const responseData = await response.json();
      console.log("Add service response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to add service");
      }

      const newService = responseData.data || responseData;
      console.log("New service:", newService);
      
      // Clean image URL before adding to state
      const cleanedService = {
        ...newService,
        image_url: getSafeImageUrl(newService.image_url)
      };
      
      setServices((prev) => [...prev, cleanedService]);
      setFormData({
        name: "",
        category: "",
        description: "",
        image_url: "",
        is_active: true,
      });
      toast.success("Service added successfully!");
    } catch (error) {
      console.error("Error adding service:", error);
      toast.error(error.message || "Failed to add service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setIsLoading(true);
      try {
        console.log("Deleting service ID:", id);
        const response = await fetch("/api/dental-services", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        const responseData = await response.json();
        console.log("Delete response:", responseData);

        if (!response.ok) {
          throw new Error(responseData.error || "Failed to delete service");
        }

        setServices((prev) => prev.filter((service) => service.id !== id));
        toast.success("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error(error.message || "Failed to delete service. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (service) => {
    console.log("Editing service:", service);
    setEditingId(service.id);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description,
      image_url: service.image_url || "",
      is_active: service.is_active,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    console.log("Updating service ID:", editingId, "with data:", formData);
    
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/dental-services", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image_url: isValidImageUrl(formData.image_url) ? formData.image_url : "",
          is_active: formData.is_active,
        }),
      });

      const responseData = await response.json();
      console.log("Update response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to update service");
      }

      const updatedService = responseData.data || responseData;
      console.log("Updated service:", updatedService);
      
      // Clean image URL before updating state
      const cleanedService = {
        ...updatedService,
        image_url: getSafeImageUrl(updatedService.image_url)
      };
      
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingId ? { ...service, ...cleanedService } : service,
        ),
      );

      setEditingId(null);
      setFormData({
        name: "",
        category: "",
        description: "",
        image_url: "",
        is_active: true,
      });
      toast.success("Service updated successfully!");
    } catch (error) {
      console.error("Error updating service:", error);
      toast.error(error.message || "Failed to update service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    console.log("Cancelling edit");
    setEditingId(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      image_url: "",
      is_active: true,
    });
  };

  // Debug: Log current state
  console.log("Current services state:", services);
  console.log("Services length:", services.length);
  console.log("Initial loading:", initialLoading);
  console.log("Is loading:", isLoading);

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-500">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          {editingId ? "Update Service" : "Add New Service"}
        </h1>
        <form
          onSubmit={editingId ? handleUpdate : handleAddService}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
              placeholder="e.g., Dental Checkup"
            />
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category *
            </label>
            <input
              type="text"
              name="category"
              id="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
              placeholder="e.g., General Dentistry"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description *
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={isLoading}
              placeholder="Describe the service in detail..."
            />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL (Optional)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                name="image_url"
                id="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
                placeholder="https://example.com/image.jpg"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
                title="Clear image URL"
              >
                Clear
              </button>
            </div>
            {formData.image_url && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-16 relative border rounded overflow-hidden bg-gray-50">
                    {isValidImageUrl(formData.image_url) ? (
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center">
                              <div class="text-center">
                                <svg class="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="text-xs text-gray-400">Invalid</span>
                              </div>
                            </div>
                          `;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-6 h-6 text-gray-400 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-gray-400">Invalid URL</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    {isValidImageUrl(formData.image_url) 
                      ? "Valid URL ✓" 
                      : "Enter a valid URL starting with http://, https://, or /"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="is_active"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service Status
            </label>
            <select
              name="is_active"
              id="is_active"
              value={String(formData.is_active)}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="true">Active (Visible to patients)</option>
              <option value="false">Inactive (Hidden from patients)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Save size={18} />
              {isLoading
                ? "Saving..."
                : editingId
                  ? "Update Service"
                  : "Add Service"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Available Services ({services.length})
          </h1>
          <div className="text-sm text-gray-500">
            {services.filter(s => s.is_active).length} active •{" "}
            {services.filter(s => !s.is_active).length} inactive
          </div>
        </div>
        
        {services.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-gray-400 mb-3">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No services found</p>
            <p className="text-sm text-gray-400">Add a new service to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const hasValidImage = service.image_url && isValidImageUrl(service.image_url);
              
              return (
                <div
                  key={service.id}
                  className={`bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full ${
                    service.is_active 
                      ? 'border-gray-200 hover:border-blue-300' 
                      : 'border-gray-100 hover:border-gray-200 opacity-80'
                  }`}
                >
                  {/* Image Section with Fallback */}
                  <div className="w-full h-48 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
                    {hasValidImage ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={service.image_url}
                          alt={service.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback if Next.js Image fails
                            const container = e.target.closest('div');
                            container.innerHTML = `
                              <div class="w-full h-full flex flex-col items-center justify-center p-4">
                                <svg class="w-16 h-16 text-blue-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p class="text-sm text-blue-500 font-medium text-center">${service.name}</p>
                                <p class="text-xs text-blue-400 mt-1">Image failed to load</p>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      // Fallback UI when no valid image
                      <div className="w-full h-full flex flex-col items-center justify-center p-4">
                        <div className="relative w-20 h-20 mb-3">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ImageIcon className="w-10 h-10 text-blue-400" />
                          </div>
                        </div>
                        <p className="text-sm text-blue-600 font-medium text-center">
                          {service.name}
                        </p>
                        <p className="text-xs text-blue-400 mt-1">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          {service.name}
                        </h2>
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          service.is_active 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {service.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                        {service.category}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">
                      {service.description}
                    </p>

                    <div className="pt-4 border-t border-gray-100 mt-auto">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(service)}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit service"
                        >
                          <Edit2 size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          disabled={isLoading}
                          className="flex-1 px-4 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete service"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;