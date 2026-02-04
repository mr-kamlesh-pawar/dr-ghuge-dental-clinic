import { NextResponse } from "next/server";
import { mockAppointments } from "@/lib/mockData";

export async function GET(request, { params }) {
  const { id } = await params;

  // Search by appointment_id string (e.g. AABHA-...)
  const appointment = mockAppointments.find((a) => a.appointment_id === id);

  if (!appointment) {
    return NextResponse.json(
      { error: "Appointment Not Found" },
      { status: 404 },
    );
  }

  return NextResponse.json(
    { success: true, data: appointment },
    { status: 200 },
  );
}
