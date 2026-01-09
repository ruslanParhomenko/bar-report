import {
  getStopList,
  StopListType,
} from "@/app/actions/stop-list/stopListAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import StopListPage from "@/features/stop-list/StopListPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "BAR", "CUCINA", "MNGR", "USER"];

export default async function Page({
  params,
}: {
  params: Promise<{ patch: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;

  const { patch } = await params;
  if (!patch) return null;
  const data = (await getStopList()) as StopListType[];

  if (!data) return null;
  const filteredData = data
    .filter((d) => d.user_email === patch)
    .map((d) => d.form_data);

  return (
    <StopListPage data={filteredData} nameTag={patch as "bar" | "cucina"} />
  );
}
