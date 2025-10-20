"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";

export async function _getremarks() {
  const remarks = await prisma.remarkReport.findMany({
    include: { remarks: true },
    orderBy: { date: "desc" },
  });
  return { remarks };
}

export const getRemarks = unstable_cache(_getremarks, ["remarks"], {
  revalidate: false,
  tags: ["remarks"],
});

export async function invalidateRemarks() {
  return revalidateTag("remarks");
}
