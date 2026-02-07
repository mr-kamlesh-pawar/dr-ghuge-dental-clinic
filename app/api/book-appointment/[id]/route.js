import { NextResponse } from "next/server";
import { listDocuments, Query } from "@/lib/appwrite";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_APPOINTMENTS;

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // First try to get by document ID (if the param is a valid document ID)
    try {
      const doc = await listDocuments(COLLECTION_ID, [
        Query.equal('$id', id)
      ]);
      
      if (doc.documents.length > 0) {
        return NextResponse.json(
          { 
            success: true, 
            data: { ...doc.documents[0], id: doc.documents[0].$id } 
          },
          { status: 200 }
        );
      }
    } catch (e) {
      // Ignore error if it's not a valid doc ID format, proceed to search by field
    }

    // Fallback: list recent appointments and find matching custom ID in memory
    // Since appointment_id is not indexed, we can't search directly. 
    // We fetch recent documents and filter manually.
    const { documents } = await listDocuments(COLLECTION_ID, [
        Query.orderDesc('$createdAt'),
        Query.limit(100) 
    ]);

    const foundDoc = documents.find(d => d.appointment_id === id);

    if (!foundDoc) {
      return NextResponse.json(
        { error: "Appointment Not Found" },
        { status: 404 },
      );
    }
    
    // Map $id to id
    const appointment = {
        ...foundDoc,
        id: foundDoc.$id
    };

    return NextResponse.json(
      { success: true, data: appointment },
      { status: 200 },
    );

  } catch (error) {
    console.error("Error fetching appointment:", error);
    return NextResponse.json({ error: "Failed to fetch appointment" }, { status: 500 });
  }
}
