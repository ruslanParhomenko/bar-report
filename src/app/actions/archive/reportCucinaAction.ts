"use server";

import { unstable_cache, updateTag } from "next/cache";
import {
  DailyReportCucina,
  Prepared,
  Remain,
  Shift,
  Staff,
  WriteOff,
} from "@/prisma/generated/prisma/client";
import prisma from "@/lib/prisma";
import { ReportCucinaType } from "@/features/report/cucina/schema";
import { REPORT_CUCINA_ACTION_TAG } from "@/constants/action-tag";

// type

export type ReportCucinaData = DailyReportCucina & {
  shifts: Shift[];
  remains: Remain[];
  prepared: Prepared[];
  staff: Staff[];
  writeOff: WriteOff[];
};
// create report
export async function createReportCucina({ data }: { data: ReportCucinaType }) {
  const {
    date,
    notes,
    shifts = [],
    remains = [],
    preparedSalads = [],
    preparedSeconds = [],
    preparedDesserts = [],
    cutting = [],
    staff = [],
    writeOff = [],
  } = data;

  const prepared = [
    ...preparedSalads,
    ...preparedSeconds,
    ...preparedDesserts,
    ...cutting,
  ];

  const report = await prisma.dailyReportCucina.create({
    data: {
      date: new Date(date),
      notes: notes || null,

      shifts: {
        create: shifts
          .filter((s) => s.employees)
          .map((s) => ({
            employees: s.employees,
            time: s.time || "",
            over: s.over || "",
          })),
      },

      remains: {
        create: remains
          .filter((r) => r.product)
          .map((r) => ({
            product: r.product,
            portions: r.portions || "",
            weight: r.weight || "",
          })),
      },

      prepared: {
        create: prepared
          .filter((p) => p.product)
          .map((p) => ({
            product: p.product,
            portions: p.portions || "",
            weight: p.weight || "",
            time: p.time || "",
          })),
      },

      staff: {
        create: staff
          .filter((s) => s.product)
          .map((s) => ({
            product: s.product,
            portions: s.portions || "",
            weight: s.weight || "",
            time: s.time || "",
          })),
      },

      writeOff: {
        create: writeOff
          .filter((w) => w.product)
          .map((w) => ({
            product: w.product,
            weight: w.weight || "",
            reason: w.reason || "",
          })),
      },
    },

    include: {
      shifts: true,
      remains: true,
      prepared: true,
      staff: true,
      writeOff: true,
    },
  });

  updateTag(REPORT_CUCINA_ACTION_TAG);
  return report.id;
}

// delete
export async function deleteReportCucina(id: string) {
  await prisma.dailyReportCucina.delete({
    where: { id: Number(id) },
    include: {
      shifts: true,
      remains: true,
      prepared: true,
      staff: true,
      writeOff: true,
    },
  });
  updateTag(REPORT_CUCINA_ACTION_TAG);
}

// get by date
export async function _getReportsCucinaByDate({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const reports = await prisma.dailyReportCucina.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      shifts: true,
      remains: true,
      prepared: true,
      staff: true,
      writeOff: true,
    },
    orderBy: { date: "desc" },
  });

  return { reports };
}

export const getReportsCucinaByDate = unstable_cache(
  _getReportsCucinaByDate,
  [REPORT_CUCINA_ACTION_TAG],
  {
    revalidate: false,
    tags: [REPORT_CUCINA_ACTION_TAG],
  },
);
