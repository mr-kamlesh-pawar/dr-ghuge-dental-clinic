"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  Save,
  Plus,
  Trash2,
  FileText,
  Pill,
  Upload,
  X,
  Calendar,
} from "lucide-react";
import { REPORT_READY_EMAIL } from "@/model/emailTemplates";

const ReportUploadPage = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ReportUploadPageContent />
    </React.Suspense>
  );
};

const ReportUploadPageContent = () => {
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("id");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reportData, setReportData] = useState({
    diagnosis: "",
    observations: "",
    treatment: "",
    next_visit: "",
  });

  const [medicines, setMedicines] = useState([{ name: "", dosage: "" }]);
  const [documents, setDocuments] = useState([
    { name: "", url: "", type: "image" },
  ]);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const featchData = async () => {
      const response = await fetch(`/api/book-appointment/${appointmentId}`);
      const data = await response.json();
      setPatient(data);
    };
    if (appointmentId) {
       featchData();
    }
  }, [appointmentId]);


  const sendReportEmail = async (patient, reporturl) => {
    if (!patient?.email) {
      console.warn("No email found for appointment → skipping email");
      return;
    }

    try {
      const response = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: patient.email,
          subject: "Your Dental Report is Ready – Dr Rahul Ghuge's Dental Clinic",
          text: `Dear ${patient.name || "Patient"}, your dental report is now ready. Please check your email for the full details.`,
          html: REPORT_READY_EMAIL({
            patientName: patient.name || "Patient",
            appointmentId: patient.appointment_id,
            reportUrl: reporturl,
          }),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `HTTP ${response.status}`);
      }
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  };

  const handleReportChange = (e) => {
    const { name, value } = e.target;
    setReportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "" }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length === 1) {
      toast.error("At least one medicine entry is required");
      return;
    }
    const updatedMedicines = medicines.filter((_, i) => i !== index);
    setMedicines(updatedMedicines);
  };

  // Document handlers
  const handleDocumentChange = (index, field, value) => {
    const updatedDocuments = [...documents];
    updatedDocuments[index][field] = value;
    setDocuments(updatedDocuments);
  };

  const addDocument = () => {
    setDocuments([...documents, { name: "", url: "", type: "image" }]);
  };

  const removeDocument = (index) => {
    if (documents.length === 1) {
      toast.error("At least one document entry is required");
      return;
    }
    const updatedDocuments = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocuments);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!reportData.diagnosis || !reportData.treatment) {
      toast.error("Diagnosis and Treatment are required fields");
      return;
    }

    const validMedicines = medicines.filter(
      (med) => med.name.trim() !== "" && med.dosage.trim() !== "",
    );

    const validDocuments = documents.filter(
      (doc) => doc.name.trim() !== "" && doc.url.trim() !== "",
    );

    setIsLoading(true);

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointment_id: appointmentId,
          diagnosis: reportData.diagnosis,
          observations: reportData.observations,
          treatment: reportData.treatment,
          next_visit: reportData.next_visit || null,
          medicines: validMedicines,
          documents: validDocuments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload report");
      }

      // Use window.location.origin to get correct base URL dynamically on client side
      const url = `${window.location.origin}/reports?appointmentId=${appointmentId}`;

      await sendReportEmail(patient.data, url);

      toast.success("Report uploaded successfully!");

      // Reset form
      setReportData({
        diagnosis: "",
        observations: "",
        treatment: "",
        next_visit: "",
      });
      setMedicines([{ name: "", dosage: "" }]);
      setDocuments([{ name: "", url: "", type: "image" }]);

      router.push(`/admin-panel`);
    } catch (error) {
      console.error("Error uploading report:", error);
      toast.error("Failed to upload report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FileText size={28} />
            Upload Medical Report
          </h1>
          <p className="text-gray-600 mt-2">
            Appointment ID:{" "}
            <span className="font-semibold">{appointmentId}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Report Details
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="diagnosis"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Diagnosis *
                </label>
                <textarea
                  id="diagnosis"
                  name="diagnosis"
                  value={reportData.diagnosis}
                  onChange={handleReportChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter diagnosis details..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="observations"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Observations
                </label>
                <textarea
                  id="observations"
                  name="observations"
                  value={reportData.observations}
                  onChange={handleReportChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Patient observations, symptoms, etc..."
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="treatment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prescribed Treatment *
                </label>
                <textarea
                  id="treatment"
                  name="treatment"
                  value={reportData.treatment}
                  onChange={handleReportChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe treatment provided..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="next_visit"
                  className="block text-sm font-medium text-gray-700 mb-1  items-center gap-2"
                >
                  <Calendar size={16} />
                  Next Visit Date
                </label>
                <input
                  type="date"
                  id="next_visit"
                  name="next_visit"
                  value={reportData.next_visit}
                  onChange={handleReportChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Pill size={22} />
                Medicines
              </h2>
              <button
                type="button"
                onClick={addMedicine}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 cursor-pointer text-white text-sm rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={16} />
                Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {medicines.map((medicine, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Medicine Name
                      </label>
                      <input
                        type="text"
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Amoxicillin 500mg"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(index, "dosage", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1 tablet, 3 times daily"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      disabled={isLoading}
                      className="absolute top-2 right-2 cursor-pointer text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Remove medicine"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Upload size={22} />
                Documents & Attachments
              </h2>
              <button
                type="button"
                onClick={addDocument}
                disabled={isLoading}
                className="px-4 py-2 bg-teal-600 text-white text-sm cursor-pointer rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Plus size={16} />
                Add Document
              </button>
            </div>

            <div className="space-y-4">
              {documents.map((document, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 relative"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document Name
                      </label>
                      <input
                        type="text"
                        value={document.name}
                        onChange={(e) =>
                          handleDocumentChange(index, "name", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., x-ray-upper-right.jpg"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Document URL
                      </label>
                      <input
                        type="text"
                        value={document.url}
                        onChange={(e) =>
                          handleDocumentChange(index, "url", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="/uploads/document.pdf"
                        disabled={isLoading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Type
                      </label>
                      <select
                        value={document.type}
                        onChange={(e) =>
                          handleDocumentChange(index, "type", e.target.value)
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                      >
                        <option value="image">Image</option>
                        <option value="pdf">PDF</option>
                        <option value="document">Document</option>
                      </select>
                    </div>
                  </div>

                  {documents.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      disabled={isLoading}
                      className="absolute top-2 cursor-pointer right-2 text-red-600 hover:text-red-700 disabled:opacity-50"
                      title="Remove document"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-green-600 text-white text-lg font-semibold rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isLoading ? "Uploading Report..." : "Upload Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportUploadPage;
