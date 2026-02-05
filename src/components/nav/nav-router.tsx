"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import SelectTabsByPatch from "./select-patch";
import { NAV_BY_ROUTE } from "./constants";

export default function NavRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const routerMain = pathname.split("/")[1];
  const routerPatch = pathname.split("/")[2];

  const navItems = NAV_BY_ROUTE[routerMain as keyof typeof NAV_BY_ROUTE] || [];

  const [isPending, startTransition] = useTransition();

  const handlePatchChange = (patch: string) => {
    if (!patch || patch === routerPatch) return;

    startTransition(() => {
      router.replace(`/${routerMain}/${patch}`);
    });
  };

  return (
    <div className="md:py-2 mt-1 mb-1 sticky top-0 z-10 flex justify-between items-center bg-background md:px-4 px-1">
      <SelectTabsByPatch
        patch={routerPatch || null}
        setPatch={handlePatchChange}
        isPending={isPending}
        navItems={navItems}
      />
    </div>
  );
}
