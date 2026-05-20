import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

// Fetch list of all users and diagnostic data (Admin only)
export async function GET(req: NextRequest) {
  try {
    const { userId, userRole, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    const users = await db.user.findMany({
      include: {
        profile: true,
        reports: {
          select: {
            id: true,
            fileName: true,
            riskLevel: true,
            createdAt: true,
          },
        },
        medications: {
          select: {
            id: true,
            name: true,
            dosage: true,
            frequency: true,
          },
        },
        consultations: {
          orderBy: { createdAt: "desc" },
        },
        vitals: {
          orderBy: { timestamp: "desc" },
          take: 10,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Admin fetch users error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete user (Admin only)
export async function DELETE(req: NextRequest) {
  try {
    const { userId: adminUserId, userRole, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;

    if (userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied. Administrator privileges required." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const targetUserId = searchParams.get("id");

    if (!targetUserId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (targetUserId === adminUserId) {
      return NextResponse.json(
        { error: "You cannot delete your own administrator account" },
        { status: 400 }
      );
    }

    await db.user.delete({
      where: { id: targetUserId },
    });

    return NextResponse.json({
      success: true,
      message: "User and all associated health records deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
