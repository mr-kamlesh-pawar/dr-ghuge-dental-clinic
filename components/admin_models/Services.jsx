"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Edit2, Save, X, Ban, CircleCheckBig } from "lucide-react";
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("/api/dental-services", {
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch services");

        const data = await res.json();
        setServices(data.services || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        toast.error("Failed to load services");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "is_active" ? value === "true" : value,
    }));
  };

  const handleAddService = async (e) => {
    e.preventDefault();
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
          image_url: formData.image_url,
          is_active: formData.is_active,
          display_order: services.length + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      const newService = await response.json();
      setServices((prev) => [...prev, newService]);
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
      toast.error("Failed to add service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/dental-services`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete service");
        }

        setServices((prev) => prev.filter((service) => service.id !== id));
        toast.success("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (service) => {
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
    if (!formData.name || !formData.category || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/dental-services`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          name: formData.name,
          category: formData.category,
          description: formData.description,
          image_url: formData.image_url,
          is_active: formData.is_active,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update service");
      }

      const updatedService = await response.json();
      setServices((prev) =>
        prev.map((service) =>
          service.id === editingId ? updatedService : service,
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
      toast.error("Failed to update service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      image_url: "",
      is_active: true,
    });
  };

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500 text-center py-8">Loading services...</p>
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
            />
          </div>

          <div>
            <label
              htmlFor="image_url"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Image URL
            </label>
            <input
              type="text"
              name="image_url"
              id="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Service is Active ?
            </label>

            <select
              name="is_active"
              id="status"
              value={String(formData.is_active)}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={18} />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Available Services
        </h1>
        {services.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No services found. Add a new service to get started!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
              >
                {service.image_url && (
                  <div className="relative w-full h-48 bg-gray-200 overflow-hidden">
                    <Image
                      src={service.image_url}
                      alt={service.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-3">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                      {service.name}
                    </h2>
                    <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                      {service.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 flex-1">
                    {service.description}
                  </p>

                  <p
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                      service.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {service.is_active ? (
                      <>
                        <CircleCheckBig size={14} />
                        Active
                      </>
                    ) : (
                      <>
                        <Ban size={14} />
                        Inactive
                      </>
                    )}
                  </p>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(service)}
                      disabled={isLoading}
                      className="flex-1 px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Edit service"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      disabled={isLoading}
                      className="flex-1 px-3 py-2 bg-red-500 text-white text-sm font-medium rounded-md hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete service"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
