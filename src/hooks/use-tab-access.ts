import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useAccessCheck(): boolean {
  const patchName = usePathname().split("/")[1];
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const session = useSession();

  const role = session?.data?.user.role!;
  const accessTabs = session?.data?.user.accessTabs || [];

  const hasAccess = useMemo(() => {
    const segmentPatchWithTabs = `${patchName}_${tab}`;
    return accessTabs.includes(segmentPatchWithTabs) || role === "ADMIN";
  }, [patchName, tab, accessTabs, role]);

  return hasAccess;
}
