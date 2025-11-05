import { getRemarks } from "@/app/actions/remarks/getRemarks";
import { getTipsForm } from "@/app/actions/tips/getTipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PageResult } from "@/features/result/PageResult";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "MNGR"];
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const role = session?.user?.role;
  if (!SET_ACCESS.includes(role as string)) return <InsufficientRights />;

  const dataTips = await getTipsForm();
  const remarks = await getRemarks();
  return <PageResult dataTips={dataTips} remarks={remarks} />;
}
