import { NextResponse } from "next/server";
import { mockAppointments } from "@/lib/mockData";

export async function GET(request) {
  return NextResponse.json({ success: true, data: mockAppointments });
}

export async function POST(request) {
  try {
    const {
      patient_name,
      phone,
      email,
      service,
      appointment_date,
      appointment_time,
      clinic,
      notes,
    } = await request.json();

    if (
      !patient_name ||
      !phone ||
      !service ||
      !appointment_date ||
      !appointment_time ||
      !clinic
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const clean = new Date(appointment_date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();

    const uniqueId =
      "AABHA-" +
      clinic.slice(0, 2).toUpperCase() +
      phone.slice(-3) +
      "-" +
      rand;
    const now = new Date();
    const createdAt = now.toISOString();

    const newAppointment = {
      id: mockAppointments.length + 1,
      name: patient_name,
      phone,
      email: email || null,
      service_name: service,
      preferred_date: clean,
      preferred_time: appointment_time,
      status: "Pending",
      notes: notes || null,
      created_at: createdAt,
      appointment_id: uniqueId,
      at: clinic,
    };

    mockAppointments.push(newAppointment);

    return NextResponse.json(
      {
        success: true,
        appointment: newAppointment,
        message: "Appointment booked successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment" },
      { status: 500 },
    );
  }
}

export async function PUT(request) {
  const { id, newStatus } = await request.json();
  try {
    const appointment = mockAppointments.find((a) => a.id === id);
    if (!appointment) {
      throw new Error("Appointment Not Found!!");
    }
    appointment.status = newStatus;
    
    return NextResponse.json({
      status: "success",
      message: "Status Changed Successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { id } = await request.json();
  const index = mockAppointments.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error("Error while deleting: Not found");
  }
  
  mockAppointments.splice(index, 1);
  
  return NextResponse.json({
    status: "success",
    message: "Appointment deleted successfully",
  });
}
