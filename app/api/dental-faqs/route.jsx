import { NextResponse } from "next/server";
import { mockFaqs } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(mockFaqs, { status: 200 });
}
