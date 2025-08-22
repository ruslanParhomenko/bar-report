import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const report = await prisma.dailyReportCucina.findUnique({
      where: { id: Number(id) },
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
    });

    if (!report) {
      return NextResponse.json(
        { message: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(report);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.dailyReport.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
