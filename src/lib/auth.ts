import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { getUsers } from "@/app/actions/users/user-action";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/signin",
    error: "/403",
  },

  debug: true,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const users = await getUsers();
        const dbUser = users.find((u) => u.mail === profile.email);

        token.role = dbUser?.role ?? "OBSERVER";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "OBSERVER";
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      const users = await getUsers();
      const dbUser = users.find((u) => u.mail === profile?.email);

      if (!dbUser) {
        return "/403";
      }

      return true;
    },
  },
};
