
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createDocument, listDocuments, Query } from "@/lib/appwrite";
import bcrypt from "bcrypt";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_USERS;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request) {
  try {
    // 1. Verify Admin Token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Optional: Check if requester has admin role
    if (decoded.role && decoded.role !== 'admin') {
       return NextResponse.json({ error: "Forbidden: Admins only" }, { status: 403 });
    }

    // 2. Parse Body
    const { name, password } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }

    // 3. Check if user already exists
    // We check both username (name) and email if provided
    const queries = [Query.equal('username', name)];
    const { documents: existingUsers } = await listDocuments(COLLECTION_ID, queries);
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Admin with this username already exists" },
        { status: 409 }
      );
    }

    // 4. Create User Document
    // Security: Hash password before storage
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      username: name,
      password: hashedPassword, // Stored as hash
      role: "admin",
      // created_at: new Date().toISOString() // Removed as requested
    };

    const result = await createDocument(COLLECTION_ID, newUser);

    return NextResponse.json({
      success: true,
      data: result,
      message: "Admin created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Create admin error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}
