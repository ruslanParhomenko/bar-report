import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { remarks } = body;

  const report = await prisma.remarkReport.create({
    data: {
      date: new Date(body.date),
      remarks: {
        create: remarks.map((remark: any) => ({
          name: remark.name,
          dayHours: remark.dayHours,
          nightHours: remark.nightHours,
          reason: remark.reason,
          penality: remark.penality,
          bonus: remark.bonus,
          reasonPenality: remark.reasonPenality,
        })),
      },
    },
    include: { remarks: true },
  });

  return NextResponse.json(report);
}

export async function GET() {
  const reports = await prisma.remarkReport.findMany({
    include: { remarks: true },
    orderBy: { date: "desc" },
  });
  return NextResponse.json(reports);
}
