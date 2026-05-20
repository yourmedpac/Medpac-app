import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medpac-fallback-secure-secret-key-123456";

// Get user vitals
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    if (!userId) {
      // Check query params as fallback
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("userId") || "";
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const vitals = await db.vitalReading.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, vitals });
  } catch (error) {
    console.error("Fetch vitals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Log new vital reading
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    let userId = "";

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        userId = decoded.userId;
      } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    const body = await req.json();
    if (!userId) {
      userId = body.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, value, unit } = body;

    if (!type || !value || !unit) {
      return NextResponse.json(
        { error: "type, value and unit are required" },
        { status: 400 }
      );
    }

    const vital = await db.vitalReading.create({
      data: {
        userId,
        type,
        value,
        unit,
      },
    });

    return NextResponse.json({ success: true, vital });
  } catch (error) {
    console.error("Save vitals error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
