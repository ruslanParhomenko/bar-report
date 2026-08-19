import { useAbility } from "@/providers/ability-provider";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useAccessCheck(): boolean {
  const patchName = usePathname().split("/")[1];
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const { accessTabs, role } = useAbility();

  const hasAccess = useMemo(() => {
    const segmentPatchWithTabs = `${patchName}_${tab}`;
    return accessTabs.includes(segmentPatchWithTabs) || role === "ADMIN";
  }, [patchName, tab, accessTabs, role]);

  return hasAccess;
}
