import EmptyPage from "@/components/page/EmptyPage";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "MNGR", "BAR"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  return <EmptyPage name="tabs" />;
}
