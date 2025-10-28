import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InfoTable from "@/features/info/InfoTable";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";

type Role = "ADMIN" | "BAR" | "CUCINA" | "USER" | "MNGR" | "OBSERVER";
export default async function InfoPage() {
  const session = await getServerSession(authOptions);

  console.log(session);
  if (!session) redirect("/signin");

  const role = session?.user?.role as Role;
  if (role === "OBSERVER") return <InsufficientRights />;

  return <InfoTable />;
}
