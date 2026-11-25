import { ADMIN } from "@/constants/roles";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getSession = cache(() => getServerSession(authOptions));

export async function requireTabAccess(segment: string, tab: string) {
  const session = await getSession();
  const user = session?.user;
  if (!user) redirect("/");

  if (user.role !== ADMIN && !user.accessTabs?.includes(`${segment}_${tab}`)) {
    return { user: null, session };
  }
  return { user, session };
}
