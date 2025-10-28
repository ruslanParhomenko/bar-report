import { getRemarks } from "@/app/actions/remarks/getRemarks";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PenaltyPage } from "@/features/penalty/PenaltyPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const role = session?.user?.role;
  if (role === "OBSERVER") return <InsufficientRights />;

  const remarks = await getRemarks();
  return <PenaltyPage data={remarks.remarks} />;
}
