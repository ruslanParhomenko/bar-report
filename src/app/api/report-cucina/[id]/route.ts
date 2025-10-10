import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.dailyReportCucina.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const report = await prisma.dailyReportCucina.findUnique({
    where: { id: Number(id) },
    include: {
      shifts: true,
      remains: true,
      prepared: true,
      staff: true,
      movement: true,
      writeOff: true,
    },
  });

  return NextResponse.json(report);
}
