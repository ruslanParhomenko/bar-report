import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { getCashFormById } from "@/app/actions/cash/cashAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import CashForm from "@/features/cash/cash-form";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH", "BAR", "FIN"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;
  const uniqueKey = `${year}-${month}`;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  const dataCash = await getCashFormById(uniqueKey);
  const dataAo = await getAOByUniqueKey(uniqueKey);

  return (
    <CashForm
      dataAo={dataAo}
      dataCash={dataCash}
      month={month as string}
      year={year as string}
    />
  );
}
