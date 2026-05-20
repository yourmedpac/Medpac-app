import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

// Get user medications
export async function GET(req: NextRequest) {
  try {
    const { userId, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;


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
    const { userId, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;

    const body = await req.json();

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
