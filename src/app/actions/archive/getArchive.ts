"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";

export const _getArchive = async () => {
  const [dailyReportCucina, dailyReport, remarkReport, breakList] =
    await prisma.$transaction([
      prisma.dailyReportCucina.findMany({
        take: 62,
        include: {
          shifts: true,
          remains: true,
          prepared: true,
          staff: true,
          movement: true,
          writeOff: true,
        },
        orderBy: { date: "desc" },
      }),
      prisma.dailyReport.findMany({
        take: 62,
        include: {
          cashVerify: true,
          tobacco: true,
          expenses: true,
          productTransfer: true,
          inventory: true,
        },
        orderBy: { date: "desc" },
      }),
      prisma.remarkReport.findMany({
        take: 62,
        include: { remarks: true },
        orderBy: { date: "desc" },
      }),
      prisma.breakList.findMany({
        take: 62,
        include: { rows: true },
        orderBy: { date: "desc" },
      }),
    ]);

  return {
    dailyReportCucina,
    dailyReport,
    remarkReport,
    breakList,
  };
};

export const getArchive = unstable_cache(_getArchive, ["archive"], {
  revalidate: false,
  tags: ["archive"],
});

export async function invalidateArchive() {
  revalidateTag("archive");
}
