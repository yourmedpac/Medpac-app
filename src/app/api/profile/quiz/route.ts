import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { userId, errorResponse } = verifyAuth(req);
    if (errorResponse) return errorResponse;


    const {
      age,
      gender,
      weight,
      height,
      bmi,
      bmiCategory,
      dietaryPreference,
      dietTypePersonality,
      mealCount,
      waterIntake,
      moodBehavior,
      stressLevel,
      exerciseFrequency,
      activityLevel,
      existingConditions,
      medications,
      familyHistory,
      sleepHours,
      smokingStatus,
      alcoholConsumption,
      healthGoals,
      focusArea,
    } = await req.json();

    // Check if user exists
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or update Profile
    await db.profile.upsert({
      where: { userId },
      update: {
        age: age ? parseInt(age) : null,
        gender,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bmi: bmi ? parseFloat(bmi) : null,
        bmiCategory,
        dietaryPreference,
        dietTypePersonality,
        mealCount: mealCount ? parseInt(mealCount) : 3,
        waterIntake: waterIntake ? parseFloat(waterIntake) : 8.0,
        moodBehavior: moodBehavior || [],
        stressLevel,
        exerciseFrequency,
        activityLevel,
        existingConditions: existingConditions || [],
        medications: medications || [],
        familyHistory: familyHistory || [],
        sleepHours: sleepHours ? parseFloat(sleepHours) : 7.0,
        smokingStatus,
        alcoholConsumption,
        healthGoals: healthGoals || [],
        focusArea: focusArea || [],
      },
      create: {
        userId,
        age: age ? parseInt(age) : null,
        gender,
        weight: weight ? parseFloat(weight) : null,
        height: height ? parseFloat(height) : null,
        bmi: bmi ? parseFloat(bmi) : null,
        bmiCategory,
        dietaryPreference,
        dietTypePersonality,
        mealCount: mealCount ? parseInt(mealCount) : 3,
        waterIntake: waterIntake ? parseFloat(waterIntake) : 8.0,
        moodBehavior: moodBehavior || [],
        stressLevel,
        exerciseFrequency,
        activityLevel,
        existingConditions: existingConditions || [],
        medications: medications || [],
        familyHistory: familyHistory || [],
        sleepHours: sleepHours ? parseFloat(sleepHours) : 7.0,
        smokingStatus,
        alcoholConsumption,
        healthGoals: healthGoals || [],
        focusArea: focusArea || [],
      },
    });

    // Mark quiz completed on the user record
    await db.user.update({
      where: { id: userId },
      data: { isQuizCompleted: true },
    });

    return NextResponse.json({
      success: true,
      message: "Quiz profile saved successfully",
    });
  } catch (error) {
    console.error("Quiz submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
