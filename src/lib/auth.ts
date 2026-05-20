import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medpac-fallback-secure-secret-key-123456";

interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

export function verifyAuth(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      userId: null,
      userRole: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Missing or invalid token format" },
        { status: 401 }
      ),
    };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    return {
      userId: decoded.userId,
      userRole: decoded.role,
      errorResponse: null,
    };
  } catch (err) {
    return {
      userId: null,
      userRole: null,
      errorResponse: NextResponse.json(
        { error: "Unauthorized: Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}
