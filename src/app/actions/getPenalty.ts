"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

export async function getPenalty() {
  const penalty = await prisma.remarkReport.findMany({
    include: { remarks: true },
    orderBy: { date: "desc" },
  });

  return { penalty };
}

export async function invalidatePenalty() {
  revalidateTag("penalty");
}
