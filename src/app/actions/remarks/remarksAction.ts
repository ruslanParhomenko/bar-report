"use server";

import { unstable_cache, updateTag } from "next/cache";
import { Remark } from "@/prisma/generated/prisma/client";
import prisma from "@/lib/prisma";
import { REMARKS_ACTION_TAG } from "@/constants/action-tag";

export type RemarksData = {
  id: number;
  date: Date;

  remarks: Remark[];
};

// create
export async function createRemarks(data: any) {
  const { date, remarks } = data;
  const remarksWithName = remarks.filter(
    (remark: any) => remark.name && remark.name.trim() !== "",
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
          penalty: remark.penalty,
          bonus: remark.bonus,
        })),
      },
    },
    include: { remarks: true },
  });

  updateTag(REMARKS_ACTION_TAG);

  return remarksData.id;
}

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
            penalty: remark.penalty || "",
            bonus: remark.bonus || "",
          })),
        },
      },
      include: { remarks: true },
    });
    return remark;
  });

  updateTag(REMARKS_ACTION_TAG);
  return updatedReport.id;
}

// delete remark
export async function deleteRemark(id: string) {
  await prisma.remarkReport.delete({
    where: { id: Number(id) },
    include: { remarks: true },
  });
  updateTag(REMARKS_ACTION_TAG);
}

// get by date
export async function _getRemarksByDate({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const remarks = await prisma.remarkReport.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: { remarks: true },
    orderBy: { date: "desc" },
  });

  return { remarks };
}

export const getRemarksByDate = unstable_cache(
  _getRemarksByDate,
  [REMARKS_ACTION_TAG],
  {
    revalidate: false,
    tags: [REMARKS_ACTION_TAG],
  },
);
