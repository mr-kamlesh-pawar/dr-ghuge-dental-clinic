"use client";
import { X } from "lucide-react";

import React, { useState } from "react";
import axios from "axios";

const getMessages = async () => {
  const data = await axios.get("http://localhost:3000/api/contact-us");
  return data.data;
};

const CnMessages = await getMessages();

const ContactMessages = () => {
  const [messages, setMessages] = useState(CnMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const openModal = (msg) => {
    setSelectedMessage(msg);
  };

  const closeModal = () => {
    setSelectedMessage(null);
  };

 const formatDateTime = (
  isoDate,
  locale = "en-IN"
) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};


  return (
    <div className="p-6">
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {messages.data.map((msg) => (
              <tr key={msg.id} className="border-b hover:bg-gray-50 transition">
                <td className="px-4 py-3">{formatDateTime(msg.$createdAt)}</td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {msg.name}
                </td>
                <td className="px-4 py-3">{msg.phone}</td>
                <td className="px-4 py-3">{msg.email}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => openModal(msg)}
                    className="text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMessage && (
        <div
          className="fixed inset-0 bg-blur bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Message Details
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X />
              </button>
            </div>

            {/* Body */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">
                  ID
                </label>
                <p className="text-gray-900">{selectedMessage.id}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Name
                </label>
                <p className="text-gray-900">{selectedMessage.name}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Phone
                </label>
                <p className="text-gray-900">{selectedMessage.phone}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Email
                </label>
                <p className="text-gray-900">{selectedMessage.email}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Status
                </label>
                <p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      selectedMessage.status === "new"
                        ? "bg-red-100 text-red-600"
                        : selectedMessage.status === "read"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                    }`}
                  >
                    {selectedMessage.status}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Date
                </label>
                <p className="text-gray-900">{formatDateTime(selectedMessage.$createdAt)}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">
                  Message
                </label>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-gray-900">{selectedMessage.messages}</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end mt-6">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
