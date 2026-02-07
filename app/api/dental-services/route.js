import { NextResponse } from "next/server";
import { 
  createDocument, 
  listDocuments, 
  updateDocument, 
  deleteDocument,
  Query 
} from "@/lib/appwrite";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_SERVICES;

// Helper function to validate required fields
const validateServiceData = (data, isUpdate = false) => {
  const errors = [];
  
  if (!isUpdate) {
    // Required fields for creation
    if (!data.name) errors.push("Name is required");
    if (!data.category) errors.push("Category is required");
    if (data.display_order === undefined || data.display_order === null) {
      errors.push("Display order is required");
    }
  }
  
  // Field type validations
  if (data.display_order !== undefined && typeof data.display_order !== 'number') {
    errors.push("Display order must be a number");
  }
  
  if (data.is_active !== undefined && typeof data.is_active !== 'boolean') {
    errors.push("Is active must be a boolean");
  }
  
  return errors;
};

export async function GET() {
  try {
    // Validate environment variable
    if (!COLLECTION_ID) {
      return NextResponse.json(
        { error: "Server configuration error: COLLECTION_ID not found" },
        { status: 500 }
      );
    }

    const { documents } = await listDocuments(COLLECTION_ID, [
      Query.orderAsc('display_order'),
      Query.limit(100) // Add limit for performance
    ]);

    // Transform documents
    const services = documents.map(doc => ({
      id: doc.$id,
      name: doc.name,
      category: doc.category,
      description: doc.description || "",
      image_url: doc.image_url || "",
      is_active: Boolean(doc.is_active),
      display_order: doc.display_order || 0,
      createdAt: doc.$createdAt,
      updatedAt: doc.$updatedAt
    }));
    
    // Extract unique categories from active services only
    const activeServices = services.filter(service => service.is_active);
    const categories = [...new Set(activeServices.map(s => s.category))]
      .filter(category => category && category.trim() !== "")
      .map(category => ({ 
        category: category,
        count: activeServices.filter(s => s.category === category).length
      }));

    return NextResponse.json({
      success: true,
      services: services,
      categories: categories,
      count: services.length,
      activeCount: activeServices.length
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to fetch services",
      message: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    // Validate collection ID
    if (!COLLECTION_ID) {
      return NextResponse.json(
        { error: "Server configuration error: COLLECTION_ID not found" },
        { status: 500 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    const validationErrors = validateServiceData(data, false);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: validationErrors
      }, { status: 400 });
    }

    const payload = {
      name: data.name.trim(),
      category: data.category.trim(),
      description: data.description?.trim() || "",
      image_url: data.image_url?.trim() || "",
      is_active: Boolean(data.is_active ?? true), // Default to true if not provided
      display_order: Number(data.display_order) || 0
    };
    
    const newDoc = await createDocument(COLLECTION_ID, payload);

    return NextResponse.json({ 
      success: true,
      id: newDoc.$id,
      message: "Service created successfully",
      data: {
        id: newDoc.$id,
        name: newDoc.name,
        category: newDoc.category,
        description: newDoc.description,
        image_url: newDoc.image_url,
        is_active: newDoc.is_active,
        display_order: newDoc.display_order,
        createdAt: newDoc.$createdAt,
        updatedAt: newDoc.$updatedAt
      }
    }, { status: 201 }); // Use 201 for created

  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ 
      success: false,
      error: "Failed to create service",
      message: error.message 
    }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    if (!COLLECTION_ID) {
      return NextResponse.json(
        { error: "Server configuration error: COLLECTION_ID not found" },
        { status: 500 }
      );
    }

    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({
        success: false,
        error: "Service ID is required"
      }, { status: 400 });
    }

    // Validate data
    const validationErrors = validateServiceData(data, true);
    if (validationErrors.length > 0) {
      return NextResponse.json({
        success: false,
        errors: validationErrors
      }, { status: 400 });
    }

    // Prepare update payload with only provided fields
    const updatePayload = {};
    if (data.name !== undefined) updatePayload.name = data.name.trim();
    if (data.category !== undefined) updatePayload.category = data.category.trim();
    if (data.description !== undefined) updatePayload.description = data.description.trim();
    if (data.image_url !== undefined) updatePayload.image_url = data.image_url.trim();
    if (data.is_active !== undefined) updatePayload.is_active = Boolean(data.is_active);
    if (data.display_order !== undefined) updatePayload.display_order = Number(data.display_order);

    const updatedDoc = await updateDocument(COLLECTION_ID, data.id, updatePayload);

    return NextResponse.json({
      success: true,
      message: "Service updated successfully",
      data: {
        id: updatedDoc.$id,
        name: updatedDoc.name,
        category: updatedDoc.category,
        description: updatedDoc.description,
        image_url: updatedDoc.image_url,
        is_active: updatedDoc.is_active,
        display_order: updatedDoc.display_order,
        updatedAt: updatedDoc.$updatedAt
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to update service",
      message: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!COLLECTION_ID) {
      return NextResponse.json(
        { error: "Server configuration error: COLLECTION_ID not found" },
        { status: 500 }
      );
    }

    const data = await request.json();
    if (!data.id) {
      return NextResponse.json({
        success: false,
        error: "Service ID is required"
      }, { status: 400 });
    }

    await deleteDocument(COLLECTION_ID, data.id);

    return NextResponse.json({
      success: true,
      message: "Service deleted successfully",
      id: data.id
    }, { status: 200 });

  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to delete service",
      message: error.message
    }, { status: 500 });
  }
}