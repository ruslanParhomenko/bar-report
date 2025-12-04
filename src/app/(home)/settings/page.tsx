import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import SettingsPage from "@/features/settings/SettingsPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "ADMIN" ? (
    <SettingsPage />
  ) : (
    <InsufficientRights />
  );
}
