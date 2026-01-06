import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TTNPage from "@/features/ttn/ttn-page";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CASH-B"];

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
  return (
    <TTNPage dataTtn={null} month={month as string} year={year as string} />
  );
}
