import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const CLOSE_ACCESS = ["OBSERVER"];
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (CLOSE_ACCESS.includes(session.user?.role ?? ""))
    return <InsufficientRights />;
  return null;
}
