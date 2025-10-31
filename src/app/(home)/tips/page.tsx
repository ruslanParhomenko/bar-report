import { getTipsForm } from "@/app/actions/tips/getTipsAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import TipsForm from "@/features/tips/TipsForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  const role = session?.user?.role;
  if (role === "OBSERVER" || role === "BAR") return <InsufficientRights />;
  const data = await getTipsForm();
  return <TipsForm initialData={data} />;
}
