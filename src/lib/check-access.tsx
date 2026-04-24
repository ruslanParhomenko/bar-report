import { SIDEBAR_NAVIGATION } from "@/components/sidebar/constants";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

export async function checkAccess(mainRoute: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const SET_ACCESS =
    SIDEBAR_NAVIGATION.find((item) => item.title === mainRoute)?.setAcces || [];
  const accessGranted =
    session.user.role === "ADMIN" ||
    SET_ACCESS.includes(session.user.role as string);

  return accessGranted;
}
