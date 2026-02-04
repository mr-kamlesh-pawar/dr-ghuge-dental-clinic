import { NextResponse } from "next/server";
import { mockContacts } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json({
    data: mockContacts,
    status: "Success",
  });
}

export async function POST(request) {
  const { name, phone, email, message } = await request.json();
  const status = "pending";
  const now = new Date();
  const createdAt = now.toISOString();

  const newMessage = {
    id: mockContacts.length + 1,
    name,
    phone,
    email,
    status,
    created_at: createdAt,
    messages: message,
  };

  mockContacts.push(newMessage);

  return NextResponse.json({
    status: "Success",
    message: "We got Your Message",
  });
}
