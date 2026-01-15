"use server";
import {
  DailyReportCucina,
  Prepared,
  Remain,
  Shift,
  Staff,
  WriteOff,
} from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";

// type

export type ReportCucinaData = DailyReportCucina & {
  shifts: Shift[];
  remains: Remain[];
  prepared: Prepared[];
  staff: Staff[];
  writeOff: WriteOff[];
};
// create report
export async function createReportCucina({ data }: { data: any }) {
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
          .filter((s: Shift) => s.employees)
          .map((s: Shift) => ({
            employees: s.employees,
            time: s.time || "",
            over: s.over || "",
          })),
      },

      remains: {
        create: remains
          .filter((r: Remain) => r.product)
          .map((r: Remain) => ({
            product: r.product,
            portions: r.portions || "",
            weight: r.weight || "",
          })),
      },

      prepared: {
        create: prepared
          .filter((p: Prepared) => p.product)
          .map((p: Prepared) => ({
            product: p.product,
            portions: p.portions || "",
            weight: p.weight || "",
            time: p.time || "",
          })),
      },

      staff: {
        create: staff
          .filter((s: Staff) => s.product)
          .map((s: Staff) => ({
            product: s.product,
            portions: s.portions || "",
            weight: s.weight || "",
            time: s.time || "",
          })),
      },

      writeOff: {
        create: writeOff
          .filter((w: WriteOff) => w.product)
          .map((w: WriteOff) => ({
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

  // updateTag("reportCucina");
  await invalidateEverywhere("reportCucina");

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
  // updateTag("reportCucina");
  await invalidateEverywhere("reportCucina");
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
  ["reportsCucina"],
  {
    revalidate: false,
    tags: ["reportCucina"],
  }
);
