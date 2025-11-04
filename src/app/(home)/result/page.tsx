import { getRemarks } from "@/app/actions/remarks/getRemarks";
import { getTipsForm } from "@/app/actions/tips/getTipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ResultTable from "@/features/result/ResultTable";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const role = session?.user?.role;
  if (role === "OBSERVER" || role === "BAR" || role === "CUCINA")
    return <InsufficientRights />;

  const dataTips = await getTipsForm();
  const remarks = await getRemarks();
  return <ResultTable dataTips={dataTips} remarks={remarks} />;
}
