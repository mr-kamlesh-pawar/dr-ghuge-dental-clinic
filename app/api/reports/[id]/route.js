import { NextResponse } from "next/server";
import { mockReports, mockMedicines, mockDocuments } from "@/lib/mockData";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    //GET report by appointment_id (logic from original file)
    
    // Note: The original file variable was `appointment_id = $1` but destructured `id`.
    // It seems `api/reports/[id]` expects `id` to be the `appointment_id`.
    
    const report = mockReports.find(r => r.appointment_id === id);

    if (!report) {
      return NextResponse.json(
        {
          error: "Report Not Found",
        },
        { status: 404 },
      );
    }
    const reportId = report.id;

    const medicines = mockMedicines.filter(m => m.report_id === reportId);
    const documents = mockDocuments.filter(d => d.report_id === reportId);

    return NextResponse.json(
      {
        report: report,
        medicines: medicines,
        documents: documents,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch",
      },
      { status: 500 },
    );
  }
}
