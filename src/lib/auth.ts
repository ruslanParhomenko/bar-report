import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { getUsers } from "@/app/actions/users/userAction";

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
    error: "/403", // куда перенаправлять при отказе
  },

  debug: true,

  callbacks: {
    // Проверяем JWT и устанавливаем роль
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const users = await getUsers();
        const dbUser = users.find((u) => u.mail === profile.email);

        if (dbUser) {
          token.role = dbUser.role;
        } else {
          token.role = "OBSERVER"; // можно оставить для безопасности, но signIn блокирует
        }
      }
      return token;
    },

    // Сессия получает роль
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role || "OBSERVER";
      }
      return session;
    },

    // Блокировка авторизации, если пользователя нет в базе
    async signIn({ user, account, profile }) {
      const users = await getUsers();
      const dbUser = users.find((u) => u.mail === profile?.email);

      if (!dbUser) {
        return "/403"; // перенаправим с сообщением
      }

      return true; // разрешаем вход
    },
  },
};
