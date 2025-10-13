import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Remark } from "@/generated/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.remarkReport.delete({
      where: { id: Number(id) },
      include: { remarks: true },
    });

    return NextResponse.json({ message: "Report deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/remarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}

//get

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const report = await prisma.remarkReport.findUnique({
      where: { id: Number(id) },
      include: { remarks: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("GET /api/remarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

//update
export async function PUT(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await _req.json();

    const reportId = Number(id);
    if (isNaN(reportId)) {
      return NextResponse.json({ error: "Invalid report id" }, { status: 400 });
    }

    const updatedReport = await prisma.$transaction(async (tx) => {
      await tx.remark.deleteMany({ where: { reportId } });

      const remark = await tx.remarkReport.update({
        where: { id: reportId },
        data: {
          remarks: {
            create: data.remarks.map((remark: Remark) => ({
              name: remark.name || "",
              dayHours: remark.dayHours || "",
              nightHours: remark.nightHours || "",
              reason: remark.reason || "",
              penality: remark.penality || "",
            })),
          },
        },
        include: { remarks: true },
      });
      return remark;
    });
    return NextResponse.json(updatedReport);
  } catch (error) {
    console.error("PUT /api/remarks/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}
