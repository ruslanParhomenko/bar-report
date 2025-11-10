"use server";

import { Remark } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";

// create
export async function createRemarks(data: any) {
  const { date, remarks } = data;
  const remarksWithName = remarks.filter(
    (remark: any) => remark.name && remark.name.trim() !== ""
  );
  const remarksData = await prisma.remarkReport.create({
    data: {
      date: new Date(date),
      remarks: {
        create: remarksWithName.map((remark: any) => ({
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
  revalidateTag("remarks");

  return remarksData.id;
}
// get all

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

// get by id

export async function getRemarksById(id: string) {
  const report = await prisma.remarkReport.findUnique({
    where: { id: Number(id) },
    include: { remarks: true },
  });
  return report;
}

// update remark

export async function updateRemark(data: any) {
  const { id } = data;

  const reportId = Number(id);
  if (isNaN(reportId)) return;

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
            bonus: remark.bonus || "",
          })),
        },
      },
      include: { remarks: true },
    });
    return remark;
  });

  revalidateTag("remarks");
  return updatedReport.id;
}

// delete remark
export async function deleteRemark(id: string) {
  await prisma.remarkReport.delete({
    where: { id: Number(id) },
    include: { remarks: true },
  });
  revalidateTag("remarks");
}
