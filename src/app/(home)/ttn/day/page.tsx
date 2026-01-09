import { getTTNByUniqueKey } from "@/app/actions/ttn/ttn-actions";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TTNDayPage from "@/features/ttn/ttn-day-page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "FIN"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { month, year } = await searchParams;
  const unique_key = `${year}-${month}`;

  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  const dataTtn = await getTTNByUniqueKey(unique_key);
  return (
    <TTNDayPage
      dataTtn={dataTtn}
      month={month as string}
      year={year as string}
    />
  );
}
