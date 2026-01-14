import { getAOByUniqueKey } from "@/app/actions/a-o/ao-action";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import AoForm from "@/features/a-o/ao-form";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH", "FIN"];

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

  const dataAo = await getAOByUniqueKey(uniqueKey);

  return (
    <AoForm dataAo={dataAo} month={month as string} year={year as string} />
  );
}
