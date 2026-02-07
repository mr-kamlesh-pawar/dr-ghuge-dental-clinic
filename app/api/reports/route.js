import { NextResponse } from "next/server";
import { createDocument } from "@/lib/appwrite";

const COLLECTION_REPORTS = process.env.APPWRITE_COLLECTION_REPORTS;
const COLLECTION_MEDICINES = process.env.APPWRITE_COLLECTION_MEDICINES;
const COLLECTION_DOCUMENTS = process.env.APPWRITE_COLLECTION_DOCUMENTS;

export async function POST(request) {
  try {
    const {
      appointment_id,
      diagnosis,
      observations,
      treatment,
      next_visit,
      medicines,
      documents,
    } = await request.json();

    if (!appointment_id || !diagnosis || !treatment) {
      return NextResponse.json(
        { error: "Appointment ID, Diagnosis, and Treatment are required" },
        { status: 400 },
      );
    }

    // 1. Create Report
    const reportPayload = {
        appointment_id,
        diagnosis,
        observations: observations || null,
        treatment,
        next_visit: next_visit || null,
        created_at: new Date().toISOString()
    };
    
    // Note: We let Appwrite generate ID, or use ID.unique()
    const newReport = await createDocument(COLLECTION_REPORTS, reportPayload);
    const reportId = newReport.$id;

    // 2. Insert medicines
    if (medicines && medicines.length > 0) {
      for (const medicine of medicines) {
        if (medicine.name && medicine.dosage) {
          await createDocument(COLLECTION_MEDICINES, {
             report_id: reportId,
             name: medicine.name,
             dosage: medicine.dosage
          });
        }
      }
    }

    // 3. Insert documents
    if (documents && documents.length > 0) {
      for (const doc of documents) {
        if (doc.name && doc.url) {
            await createDocument(COLLECTION_DOCUMENTS, {
                report_id: reportId,
                name: doc.name,
                url: doc.url,
                type: doc.type || "image"
            });
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Report uploaded successfully",
        reportId: reportId, // returning the Appwrite ID
      },
      { status: 200 },
    );

  } catch (error) {
    console.error("Error while uploading report:", error);
    return NextResponse.json(
      {
        error: "upload failed",
      },
      { status: 500 },
    );
  }
}
