"use server";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

// get
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
