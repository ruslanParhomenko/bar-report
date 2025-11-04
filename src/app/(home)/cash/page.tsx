import { getCashForm } from "@/app/actions/cash/cashAction";
import { getTipsForm } from "@/app/actions/tips/getTipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import CashForm from "@/features/cash/CashForm";
import { CashFormType } from "@/features/cash/schema";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const role = session?.user?.role;
  if (role === "OBSERVER" || role === "BAR") return <InsufficientRights />;

  const cashData = await getCashForm();
  return <CashForm initialData={cashData} />;
}
