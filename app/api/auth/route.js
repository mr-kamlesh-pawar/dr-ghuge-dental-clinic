import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { listDocuments, updateDocument, Query } from "@/lib/appwrite";
import bcrypt from "bcrypt";

const COLLECTION_ID = process.env.APPWRITE_COLLECTION_USERS;

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { valid: false, message: "Username and password are required" },
        { status: 400 },
      );
    }

    // Query User from Appwrite
    // Note: We are using a custom Users collection here, not Appwrite Auth
    const { documents } = await listDocuments(COLLECTION_ID, [
        Query.equal('username', username)
    ]);
    
    const user = documents.length > 0 ? documents[0] : null;

    if (!user) {
      return NextResponse.json(
        { valid: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 3. Verify Password (Hash or Plaintext)
    // In a production environment, we often have legacy plaintext passwords.
    // We check if it matches the hash first. If not, we check plaintext.
    // If plaintext matches, we UPGRADE the account to use a hash immediately.
    
    let isMatch = false;
    let needsUpgrade = false;

    // Check if stored password looks like a bcrypt hash
    const isHash = user.password && user.password.startsWith('$2b$');

    if (isHash) {
        isMatch = await bcrypt.compare(password, user.password);
    } else {
        // Fallback for legacy plaintext
        isMatch = user.password === password;
        if (isMatch) needsUpgrade = true;
    }

    if (!isMatch) {
      return NextResponse.json(
        { valid: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // 4. Automatic Security Upgrade
    if (needsUpgrade) {
        try {
            const hasedPassword = await bcrypt.hash(password, 10);
            await updateDocument(COLLECTION_ID, user.$id, {
                password: hasedPassword
            });
            console.log(`[Auth] User ${username} password upgraded to hash security.`);
        } catch (e) {
            console.error("[Auth] Failed to upgrade password security:", e);
            // Non-blocking error, user can still log in
        }
    }

    const token = jwt.sign(
      {
        userId: user.$id,
        username: user.username,
        role: user.role || "admin",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    return NextResponse.json(
      {
        valid: true,
        token: token,
        message: "Login successful",
        user: {
          id: user.$id,
          username: user.username,
          role: user.role || "admin",
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json(
      { valid: false, message: "An error occurred during authentication" },
      { status: 500 },
    );
  }
}
