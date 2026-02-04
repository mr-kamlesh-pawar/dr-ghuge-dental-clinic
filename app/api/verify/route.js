import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { valid: false, message: "No token provided" },
        { status: 401 },
      );
    }
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);

      return NextResponse.json(
        {
          valid: true,
          user: {
            userId: decoded.userId,
            username: decoded.username,
            role: decoded.role,
          },
          message: "Token is valid",
        },
        { status: 200 },
      );
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);

      let errorMessage = "Invalid token";

      if (jwtError.name === "TokenExpiredError") {
        errorMessage = "Token has expired";
      } else if (jwtError.name === "JsonWebTokenError") {
        errorMessage = "Invalid token signature";
      }

      return NextResponse.json(
        { valid: false, message: errorMessage },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { valid: false, message: "An error occurred during verification" },
      { status: 500 },
    );
  }
}
