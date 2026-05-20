import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

// Get user vitals
export async function GET(req: NextRequest) {
  try {
    const { userId, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;


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
    const { userId, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();

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
