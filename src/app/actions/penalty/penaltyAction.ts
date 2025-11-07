"use server";
import { prisma } from "@/lib/prisma";

export async function getPenalty() {
  const penalty = await prisma.remarkReport.findMany({
    include: { remarks: true },
    orderBy: { date: "desc" },
  });

  return { penalty };
}
