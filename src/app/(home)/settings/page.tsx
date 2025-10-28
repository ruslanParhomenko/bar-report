import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import SettingsPage from "@/features/settings/SettingsPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const role = session?.user?.role;
  if (role === "OBSERVER") return <InsufficientRights />;

  return <SettingsPage />;
}
