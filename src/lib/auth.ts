import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
// import { getUsers } from "@/app/actions/users/getUsers";

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
  },

  debug: true,

  // callbacks: {
  //   /**
  //    * 1️⃣ Добавляем роль в JWT при логине
  //    */
  //   async jwt({ token, account, profile }) {
  //     // token.sub — это ID Google-пользователя
  //     if (account && profile) {
  //       // Получаем всех пользователей из твоей таблицы
  //       const users = await getUsers();

  //       // Ищем пользователя по email
  //       const dbUser = users.find((u) => u.mail === profile.email);

  //       // Если нашли — сохраняем роль
  //       if (dbUser) {
  //         token.role = dbUser.role;
  //       } else {
  //         token.role = "OBSERVER"; // роль по умолчанию
  //       }
  //     }

  //     return token;
  //   },

  //   /**
  //    * 2️⃣ Передаём роль в session
  //    */
  //   async session({ session, token }) {
  //     if (session.user) {
  //       (session.user as any).role = token.role || "OBSERVER";
  //     }
  //     return session;
  //   },
  // },
};
