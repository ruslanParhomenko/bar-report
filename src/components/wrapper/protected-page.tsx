import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { checkAccess } from "@/lib/check-access";

export async function ProtectedPage({
  route,
  children,
}: {
  route: string;
  children: React.ReactNode;
}) {
  const hasAccess = await checkAccess(route);
  if (!hasAccess) return <InsufficientRights />;
  return <>{children}</>;
}
