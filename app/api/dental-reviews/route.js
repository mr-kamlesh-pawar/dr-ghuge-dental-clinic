import { NextResponse } from "next/server";
import { mockReviews } from "@/lib/mockData";

export async function GET() {
  return NextResponse.json(mockReviews, { status: 200 });
}
