import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import InfoTable from "@/features/info/InfoTable";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";

export default async function InfoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const role = session?.user?.role;
  if (role === "OBSERVER") return <InsufficientRights />;

  return <InfoTable />;
}
