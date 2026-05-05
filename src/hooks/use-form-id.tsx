"use client";

import { getFormIdFromPathname } from "@/lib/utils";
import { usePathname } from "next/navigation";

export function useFormId(): string {
  const pathname = usePathname();
  return getFormIdFromPathname(pathname);
}
