import { NextResponse } from "next/server";

export async function GET() {
  const config = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
    apiKey: process.env.APPWRITE_API_KEY ? "✓ Set" : "✗ Missing",
    databaseId: process.env.APPWRITE_DATABASE_ID,
    collections: {
      appointments: process.env.APPWRITE_COLLECTION_APPOINTMENTS || "✗ Missing",
      contacts: process.env.APPWRITE_COLLECTION_CONTACTS || "✗ Missing",
      reviews: process.env.APPWRITE_COLLECTION_REVIEWS || "✗ Missing",
      reports: process.env.APPWRITE_COLLECTION_REPORTS || "✗ Missing",
      medicines: process.env.APPWRITE_COLLECTION_MEDICINES || "✗ Missing",
      faqs: process.env.APPWRITE_COLLECTION_FAQS || "✗ Missing",
      services: process.env.APPWRITE_COLLECTION_SERVICES || "✗ Missing",
      users: process.env.APPWRITE_COLLECTION_USERS || "✗ Missing",
      documents: process.env.APPWRITE_COLLECTION_DOCUMENTS || "✗ Missing",
    }
  };

  return NextResponse.json({
    message: "Appwrite Configuration Check",
    config,
    warnings: [
      config.apiKey === "✗ Missing" ? "⚠️ APPWRITE_API_KEY is not set!" : null,
      Object.values(config.collections).some(v => v === "✗ Missing") ? "⚠️ Some collection IDs are missing!" : null,
    ].filter(Boolean)
  });
}
