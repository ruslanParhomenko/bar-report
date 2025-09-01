// /app/api/archive/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const revalidate = 43200;

export async function GET() {
  const [dailyReportCucina, dailyReport, remarkReport, breakeList] =
    await prisma.$transaction([
      prisma.dailyReportCucina.findMany({
        take: 31,
        include: {
          shifts: true,
          remains: true,
          preparedSalads: true,
          preparedSeconds: true,
          preparedDesserts: true,
          cutting: true,
          staff: true,
          movement: true,
          writeOff: true,
        },
        orderBy: { date: "desc" },
      }),
      prisma.dailyReport.findMany({
        take: 31,
        include: {
          cashVerify: true,
          tobacco: true,
          expenses: true,
          productTransfer: true,
        },
        orderBy: { date: "desc" },
      }),
      prisma.remarkReport.findMany({
        take: 31,
        include: { remarks: true },
        orderBy: { date: "desc" },
      }),
      prisma.breakeList.findMany({
        take: 31,
        include: {
          rows: true,
        },
        orderBy: { date: "desc" },
      }),
    ]);

  return NextResponse.json(
    { dailyReportCucina, dailyReport, remarkReport, breakeList },
    {
      headers: {
        "Cache-Control": "s-maxage=43200, stale-while-revalidate=59",
      },
    }
  );
}
