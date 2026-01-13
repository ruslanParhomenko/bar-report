import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import ReportCucinaForm from "@/features/report/cucina/ReportCucinaForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CUCINA"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  return <ReportCucinaForm />;
}
