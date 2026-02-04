import {
  CalendarClock,
  Download,
  FileText,
  Paperclip,
  Pill,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const Report = ({ id }) => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/reports/${id}`);
        if (!response.ok) {
          setError(true);
          setIsLoading(false);
          return;
        }
        const data = await response.json();
        setReportData(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setError(true);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Loading report...</p>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="min-h-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <AlertCircle size={48} className="text-gray-400" />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            No Report Found
          </h2>
          <p className="text-gray-600 mb-6">
            Reports will be shown here once your appointment is completed and
            the doctor uploads your medical report.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Reports are usually available within 24
              hours after your consultation.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Destructure the nested structure
  const { report, medicines, documents } = reportData;

  return (
    <div className="space-y-6">
      {/* Report Details */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText size={20} />
          Your Report
        </h2>
        <div className="space-y-4">
          {/* Diagnosis */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Diagnosis
            </h3>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {report.diagnosis}
            </p>
          </div>

          {/* Observations */}
          {report.observations && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Observations
              </h3>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
                {report.observations}
              </p>
            </div>
          )}

          {/* Prescribed Treatment */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Prescribed Treatment
            </h3>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md">
              {report.treatment}
            </p>
          </div>

          {/* Medicines */}
          {medicines && medicines.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <Pill size={16} />
                Medicines
              </h3>
              <div className="space-y-2">
                {medicines.map((med, index) => (
                  <div
                    key={index}
                    className="bg-blue-50 border border-blue-100 p-3 rounded-md"
                  >
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{med.dosage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Visit */}
          {report.next_visit && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <CalendarClock size={16} />
                Next Visit
              </h3>
              <p className="text-gray-900 bg-green-50 border border-green-100 p-3 rounded-md font-medium">
                {new Date(report.next_visit).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Attachments/Documents */}
      {documents && documents.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Paperclip size={20} />
            Attachments
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((file, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                {file.type === "image" ? (
                  <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-2">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-gray-50 rounded-md mb-2">
                    <FileText size={48} className="text-gray-400" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700 truncate flex-1">
                    {file.name}
                  </p>
                  <a
                    href={file.url}
                    download
                    className="ml-2 text-blue-600 hover:text-blue-700"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;
