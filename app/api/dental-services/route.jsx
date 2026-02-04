import { NextResponse } from "next/server";
import { mockServices } from "@/lib/mockData";

export async function GET() {
  const categories = [...new Set(mockServices.map((s) => s.category))].map(
    (c) => ({ category: c }),
  );

  return NextResponse.json(
    {
      services: mockServices,
      categories: categories,
    },
    { status: 200 },
  );
}

export async function POST(request) {
  const { name, category, description, image_url, is_active, display_order } =
    await request.json();

  const newService = {
    id: mockServices.length + 1, // Simple ID generation
    name,
    category,
    description,
    image_url,
    is_active,
    display_order,
  };

  mockServices.push(newService);

  return NextResponse.json(newService, { status: 200 });
}

export async function PUT(request) {
  const { id, name, category, description, image_url, is_active } =
    await request.json();
  
  const index = mockServices.findIndex((s) => s.id === id);
  if (index === -1) {
    throw new Error("Error while updating: Service not found");
  }

  const updatedService = {
    ...mockServices[index],
    name,
    category,
    description,
    image_url,
    is_active,
  };

  mockServices[index] = updatedService;

  return NextResponse.json(updatedService, { status: 200 });
}

export async function DELETE(request) {
  const { id } = await request.json();
  const index = mockServices.findIndex((s) => s.id === id);
  
  if (index === -1) {
    throw new Error("Error while deleting service: Not found");
  }

  const deleted = mockServices.splice(index, 1)[0];

  return NextResponse.json(
    {
      message: "Service deleted successfully",
      deleted: deleted,
    },
    { status: 200 },
  );
}
