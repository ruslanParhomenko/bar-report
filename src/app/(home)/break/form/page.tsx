import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import BreakRemarkPage from "@/features/break-remarks/break-page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "BAR", "CUCINA", "MNGR", "USER"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  return <BreakRemarkPage />;
}
