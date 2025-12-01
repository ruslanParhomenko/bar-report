import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { PageResult } from "@/features/result/PageResult";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "MNGR"];
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { role, month, year } = await searchParams;
  const uniqueKeySchedule = `${year}-${month}`;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const roleUser = session?.user?.role;
  if (!SET_ACCESS.includes(roleUser as string)) return <InsufficientRights />;

  return <PageResult />;
}
