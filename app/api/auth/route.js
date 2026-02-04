import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { mockUsers } from "@/lib/mockData";

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

    // Mock Authentication Logic
    const user = mockUsers.find((u) => u.username === username);

    if (!user) {
      return NextResponse.json(
        { valid: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // In a real app, use bcrypt.compare. For mock, we check plain text or assume valid if strictly testing.
    // Let's match the mock password defined in mockData.js
    const isValid = user.password === password; 

    if (!isValid) {
      return NextResponse.json(
        { valid: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: "admin",
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
          id: user.id,
          username: user.username,
          role: "admin",
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
