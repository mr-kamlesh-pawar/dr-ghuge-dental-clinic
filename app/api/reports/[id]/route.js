import { NextResponse } from "next/server";
import { listDocuments, Query } from "@/lib/appwrite";

const COLLECTION_REPORTS = process.env.APPWRITE_COLLECTION_REPORTS;
const COLLECTION_MEDICINES = process.env.APPWRITE_COLLECTION_MEDICINES;
const COLLECTION_DOCUMENTS = process.env.APPWRITE_COLLECTION_DOCUMENTS;

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    // 1. Fetch Report by appointment_id
    const { documents: reports } = await listDocuments(COLLECTION_REPORTS, [
        Query.equal('appointment_id', id)
    ]);

    if (reports.length === 0) {
      return NextResponse.json(
        { error: "Report Not Found" },
        { status: 404 },
      );
    }
    
    const report = reports[0];
    const reportId = report.$id;

    // 2. Fetch Medicines & Documents linked to reportId
    const { documents: medicines } = await listDocuments(COLLECTION_MEDICINES, [
        Query.equal('report_id', reportId)
    ]);
    
    const { documents: documentsList } = await listDocuments(COLLECTION_DOCUMENTS, [
        Query.equal('report_id', reportId)
    ]);

    return NextResponse.json(
      {
        report: { ...report, id: report.$id },
        medicines: medicines.map(m => ({ ...m, id: m.$id })),
        documents: documentsList.map(d => ({ ...d, id: d.$id })),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { error: "Failed to fetch" },
      { status: 500 },
    );
  }
}
