import { getCashFormById } from "@/app/actions/cash/cashAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PageCash } from "@/features/cash/PageCash";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH", "BAR"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const uniqueKey = `${year}-${month}`;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  const dataCash = await getCashFormById(uniqueKey);

  return (
    <PageCash
      dataCash={dataCash}
      month={month as string}
      year={year as string}
    />
  );
}
