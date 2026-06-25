import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth/next";

export async function GET() {
  try {
    await dbConnect();
    const topScores = await User.find({})
      .sort({ highScore: -1 })
      .limit(10)
      .select("username highScore image");
      
    return NextResponse.json(topScores);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch scores" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { score, coins } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email: session.user.email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Update high score if necessary
    if (score > user.highScore) {
      user.highScore = score;
    }
    
    // Increment total coins
    user.coins += coins;
    await user.save();

    return NextResponse.json({ 
      success: true, 
      highScore: user.highScore, 
      totalCoins: user.coins 
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update score" }, { status: 500 });
  }
}
