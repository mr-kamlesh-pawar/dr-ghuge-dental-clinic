import { NextResponse } from "next/server";
import { listDocuments, Query } from "@/lib/appwrite";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_FAQS;

export async function GET() {
  try {
    const { documents } = await listDocuments(COLLECTION_ID, [
        Query.orderDesc('$createdAt')
    ]);

    const faqs = documents.map(doc => ({
      ...doc,
      id: doc.$id
    }));

    return NextResponse.json(faqs, { status: 200 });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Failed to fetch FAQs" }, { status: 500 });
  }
}
