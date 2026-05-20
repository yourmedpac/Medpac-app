import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "medpac-fallback-secure-secret-key-123456";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, loginMethod } = await req.json();

    if (!email && !phone) {
      return NextResponse.json(
        { error: "Either email or phone is required" },
        { status: 400 }
      );
    }

    // Try to find the user by email or phone
    let user = null;
    
    if (email) {
      user = await db.user.findUnique({
        where: { email },
        include: { profile: true },
      });
    }

    if (!user && phone) {
      user = await db.user.findFirst({
        where: { phone },
        include: { profile: true },
      });
    }

    // If user does not exist, create a new one
    if (!user) {
      user = await db.user.create({
        data: {
          email: email || `user_${Date.now()}@medpac.in`,
          phone: phone || null,
          name: name || "User",
          isQuizCompleted: false,
        },
        include: { profile: true },
      });
    } else {
      // Update phone or name if missing
      const updateData: any = {};
      if (name && !user.name) updateData.name = name;
      if (phone && !user.phone) updateData.phone = phone;
      
      if (Object.keys(updateData).length > 0) {
        user = await db.user.update({
          where: { id: user.id },
          data: updateData,
          include: { profile: true },
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isQuizCompleted: user.isQuizCompleted,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Mobile sync error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
