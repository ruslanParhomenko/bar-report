import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function checkAccess(setAccess: string[]): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) return false;
  return setAccess.includes(session.user.role as string);
}
