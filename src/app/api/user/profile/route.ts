import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    // Try to connect with a short timeout
    await Promise.race([
      dbConnect(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 5000))
    ]);

    const session = await getServerSession();
    const guestId = req.headers.get("x-guest-id") || "guest";
    const email = session?.user?.email || `guest_${guestId}@local`;
    const name = session?.user?.name || `Guest#${guestId.slice(0, 4)}`;

    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        username: name,
        coins: 100,
        highScore: 0,
        skins: ["default"],
        boards: ["surf_basic"],
        activeSkin: "default",
        activeBoard: "surf_basic"
      });
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile GET error:", error.message);
    return NextResponse.json({ 
      error: "Profile Unavailable", 
      details: error.message,
      isGuest: true 
    }, { status: 200 }); // Return 200 with error so frontend can fallback to LocalStorage
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    const guestId = req.headers.get("x-guest-id") || "guest";
    const email = session?.user?.email || `guest_${guestId}@local`;

    const { _id, __v, createdAt, ...updateData } = await req.json();

    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Profile POST error:", error.message);
    return NextResponse.json({ error: "Save Failed", details: error.message }, { status: 200 });
  }
}
