import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { connectDB } from "@/lib/mongodb";
import { UserModel } from "@/models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email) {
        await connectDB();
        const existing = await UserModel.findOne({ email: profile.email });
        if (!existing) {
          await UserModel.create({
            email: profile.email,
            name: profile.name || profile.email.split("@")[0],
            image: (profile as any).picture,
            queriesToday: 0,
            lastQueryAt: null,
          });
        }
      }
      return true;
    },
    async session({ session }) {
      if (session.user?.email) {
        await connectDB();
        const user = await UserModel.findOne({ email: session.user.email });
        if (user) {
          session.user.id = user._id.toString();
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/ask",
  },
});
