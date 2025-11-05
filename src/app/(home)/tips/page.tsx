import { getCashForm } from "@/app/actions/cash/cashAction";
import { getTipsForm } from "@/app/actions/tips/getTipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TipsForm from "@/features/tips/TipsForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH", "MNGR"];
export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const role = session?.user?.role;
  if (!SET_ACCESS.includes(role as string)) return <InsufficientRights />;
  const dataTips = await getTipsForm();
  const dataCash = await getCashForm();
  return <TipsForm dataTips={dataTips} dataCash={dataCash} />;
}
