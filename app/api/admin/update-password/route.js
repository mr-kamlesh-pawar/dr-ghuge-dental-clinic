
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateDocument, getDocument, listDocuments, Query } from "@/lib/appwrite";
import bcrypt from "bcrypt";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_USERS;
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 1. Verify Authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);

    // Verify token and get userId
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const { currentPassword, newPassword } = await request.json();

      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: "Passwords required" }, { status: 400 });
      }

      // 2. Get User Document
      // We use getDocument with userId from token (stored in decoded.userId)
      // Note: Assumes `userId` in token matches doc.$id
      let userDoc;
      try {
        userDoc = await getDocument(COLLECTION_ID, decoded.userId);
      } catch (e) {
        // Fallback: fetch by username if ID mismatch or not found
        const { documents } = await listDocuments(COLLECTION_ID, [
             Query.equal('username', decoded.username)
        ]);
        if (documents.length > 0) userDoc = documents[0];
      }

      if (!userDoc) {
          return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // 3. Verify Current Password
      // Check if stored password is a hash
      let isMatch = false;
      const storedPassword = userDoc.password || "";
      
      if (storedPassword.startsWith('$2b$')) {
          isMatch = await bcrypt.compare(currentPassword, storedPassword);
      } else {
          // Legacy plaintext check
          isMatch = storedPassword === currentPassword;
      }

      if (!isMatch) {
           return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
      }

      // 4. Update Password (Hash new password)
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await updateDocument(COLLECTION_ID, userDoc.$id, {
          password: hashedPassword,
          // updated_at: new Date().toISOString()
      });

      return NextResponse.json({ 
          success: true, 
          message: "Password updated successfully" 
      });

    } catch (jwtError) {
      console.error("JWT Error:", jwtError);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Update password error:", error);
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    );
  }
}
