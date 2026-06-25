export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is missing");
    }

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
    return NextResponse.json({ 
      error: "Connection Failed", 
      details: error.message,
      entries: [] 
    }, { status: 200 });
  }
}
