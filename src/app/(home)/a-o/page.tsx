import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import PageAo from "@/features/a-o/PageA0";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH"];

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

  const dataAo = await getAOByUniqueKey(uniqueKey);

  return (
    <PageAo dataAo={dataAo} month={month as string} year={year as string} />
  );
}
