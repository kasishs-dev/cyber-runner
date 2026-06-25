import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await dbConnect();
      const existingUser = await User.findOne({ email: user.email });
      
      if (!existingUser) {
        await User.create({
          email: user.email,
          username: user.name || user.email?.split("@")[0],
          image: user.image,
          coins: 0,
          highScore: 0,
          skins: ["default"],
          activeSkin: "default",
        });
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user) {
        await dbConnect();
        const userData = await User.findOne({ email: session.user.email });
        if (userData) {
          (session as any).user.id = userData._id;
          (session as any).user.coins = userData.coins;
          (session as any).user.highScore = userData.highScore;
          (session as any).user.skins = userData.skins;
          (session as any).user.activeSkin = userData.activeSkin;
        }
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
