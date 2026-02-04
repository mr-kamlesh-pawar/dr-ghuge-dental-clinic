import { NextResponse } from "next/server";
import { mockReports, mockMedicines, mockDocuments } from "@/lib/mockData";

export async function GET(request, { params }) {
  // Original route seemed to use ID from params but was in api/reports/route.js? 
  // Wait, the original file had `export async function GET(request, { params })` but it was `api/reports/route.js`.
  // Usually this file handles collection or non-param requests.
  // The original code tried `const { id } = params;` then `SELECT ... WHERE appointment_id = $1`.
  // This implies `api/reports/route.js` was potentially misused or I should check if it was intended to search by query param?
  // But Next.js App Router `route.js` at root doesn't capture params unless in `[id]`.
  // However, the original code had `GET(request, { params })` and destructured `id`.
  // If this file is strictly `api/reports/route.js`, `params` would be empty/undefined for dynamic routes.
  // Let's look at `api/reports/[id]/route.js` - that one clearly had params.
  // The file I read `api/reports/route.js` (Step 39) definitely had `const { id } = params;`.
  // This might have been a bug in the original code or it relies on something I am missing.
  // BUT, looking at the logic: it fetches a SINGLE report by appointment_id.
  // If the frontend calls `api/reports?id=...`, that validation would fail or it would be undefined.
  // However, I will strictly follow the pattern: Mocking the DB replacement.
  // If the file expects `params.id`, I will keep expecting it or handle it gracefully.
  // Actually, I should probably check if `params` exists.
  
  // Wait, if I am in `api/reports/route.js`, `params` is likely empty.
  // I will check query parameters instead just in case, or default to returning all reports if no ID is present, 
  // BUT the original code was: `SELECT ... FROM reports WHERE appointment_id = $1` using `id` from params.
  // I'll stick to the original logic but adding a check to avoid crash if params is missing.
  // Actually, I suspect the original code might have been intended for `[id]` or the user calls it differently.
  
  // Let's implement a safe version:
  // If params.id is present, filter by it. If not, maybe check searchParams?
  // The original code definitely used `params`.
  
  try {
    const { id } = params || {}; // Safe destructuring
    
    // If id is missing, maybe they meant to list all reports? 
    // But original returned 404 "Report Not Found" if rows.length === 0.
    // So if no ID, it likely failed.
    
    if (!id) {
       // Maybe this route is not used as I think, or strictly for [id]? 
       // But Step 39 was `app/api/reports/route.js`.
       // Let's just assume it needs an ID and try to find it.
       // For now I will replicate the logic: find report by appointment_id = id.
       return NextResponse.json({ error: "Report Not Found" }, { status: 404 });
    }

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

    // Report Insert
    const reportId = mockReports.length > 0 ? Math.max(...mockReports.map(r => r.id)) + 1 : 1;
    
    // Insert medicines
    if (medicines && medicines.length > 0) {
      for (const medicine of medicines) {
        if (medicine.name && medicine.dosage) {
          mockMedicines.push({
             id: mockMedicines.length + 1,
             report_id: reportId,
             name: medicine.name,
             dosage: medicine.dosage
          });
        }
      }
    }

    // Insert documents
    if (documents && documents.length > 0) {
      for (const document of documents) {
        if (document.name && document.url) {
            mockDocuments.push({
                id: mockDocuments.length + 1,
                report_id: reportId,
                name: document.name,
                url: document.url,
                type: document.type || "image"
            });
        }
      }
    }
    
    const newReport = {
        id: reportId,
        appointment_id,
        diagnosis,
        observations: observations || null,
        treatment,
        next_visit: next_visit || null,
        created_at: new Date().toISOString()
    };
    mockReports.push(newReport);

    return NextResponse.json(
      {
        success: true,
        message: "Report uploaded successfully",
        reportId: reportId,
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
