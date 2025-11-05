import { getCashForm } from "@/app/actions/cash/cashAction";

import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import CashForm from "@/features/cash/CashForm";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const role = session?.user?.role;
  if (!SET_ACCESS.includes(role as string)) return <InsufficientRights />;

  const cashData = await getCashForm();
  return <CashForm initialData={cashData} />;
}
