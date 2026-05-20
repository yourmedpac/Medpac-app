import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medpac-fallback-secure-secret-key-123456";

// Get user medications
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
      const { searchParams } = new URL(req.url);
      userId = searchParams.get("userId") || "";
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const medications = await db.medication.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, medications });
  } catch (error) {
    console.error("Fetch medications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add new medication
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

    const { name, dosage, instructions, frequency, totalDoses } = body;

    if (!name || !dosage || !frequency) {
      return NextResponse.json(
        { error: "name, dosage and frequency are required" },
        { status: 400 }
      );
    }

    const medication = await db.medication.create({
      data: {
        userId,
        name,
        dosage,
        instructions: instructions || null,
        frequency,
        totalDoses: totalDoses ? parseInt(totalDoses) : 30,
        remainingDoses: totalDoses ? parseInt(totalDoses) : 30,
      },
    });

    return NextResponse.json({ success: true, medication });
  } catch (error) {
    console.error("Save medication error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
