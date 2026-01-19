import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

export async function checkAccess(setAccess: string[]): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  return setAccess.includes(session.user.role as string);
}
