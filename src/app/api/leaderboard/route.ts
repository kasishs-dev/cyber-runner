import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await Promise.race([
      dbConnect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 5000))
    ]);

    // Fetch top 10 users by high score
    const topUsers = await User.find({})
      .sort({ highScore: -1 })
      .limit(10)
      .select("username highScore image");

    return NextResponse.json(topUsers);
  } catch (error: any) {
    console.error("Leaderboard error:", error.message);
    // Return empty array so the UI shows "No Data Found" instead of crashing
    return NextResponse.json([], { status: 200 });
  }
}
