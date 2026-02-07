import { NextResponse } from "next/server";
import { createDocument, listDocuments, Query } from "@/lib/appwrite";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_CONTACTS;

export async function GET() {
  try {
    const { documents } = await listDocuments(COLLECTION_ID, [
        Query.orderDesc('$createdAt')
    ]);
    
    // map $id to id
    const contacts = documents.map(doc => ({
        ...doc,
        id: doc.$id
    }));

    return NextResponse.json({
      data: contacts,
      status: "Success",
    });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, phone, email, message } = await request.json();
    const status = "pending";

    const payload = {
      name,
      phone,
      email,
      status,
      messages: message, // Assuming 'messages' is the field name in Appwrite
    };

    const newContact = await createDocument(COLLECTION_ID, payload);

    return NextResponse.json({
      status: "Success",
      message: "We got Your Message",
      data: { ...newContact, id: newContact.$id }
    });
  } catch (error) {
    console.error("Error creating contact:", error);
    return NextResponse.json({ error: "Failed to submit contact" }, { status: 500 });
  }
}
