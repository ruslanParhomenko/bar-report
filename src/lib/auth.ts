import { getUsers } from "@/app/actions/users/user-action";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_EMAIL = process.env.ADMIN_GMAIL;

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

  debug: false,

  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const users = (await getUsers()).filter((u) => u.status);

          const dbUser = users.find((u) => u.mail === profile.email);

          token.role =
            profile.email === ADMIN_EMAIL
              ? "ADMIN"
              : (dbUser?.role ?? "OBSERVER");
        } catch (e) {
          console.error("JWT ERROR:", e);
          token.role = "OBSERVER";
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role ?? "OBSERVER";
      }
      return session;
    },

    async signIn({ profile }) {
      try {
        if (profile?.email === ADMIN_EMAIL) return true;

        const users = (await getUsers()).filter((u) => u.status);
        const dbUser = users.find((u) => u.mail === profile?.email);

        if (!dbUser) return "/403";

        return true;
      } catch (e) {
        console.error("SIGNIN ERROR:", e);
        return "/403"; // не 500!
      }
    },
  },
};
