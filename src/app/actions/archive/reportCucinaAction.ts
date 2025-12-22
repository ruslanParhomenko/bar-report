"use server";
import { Movement, Remain, Shift, Staff, WriteOff } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";

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
    movement = [],
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
          .filter((s: Shift) => s.name)
          .map((s: Shift) => ({
            name: s.name,
            time: s.time || "",
            over: s.over || "",
            employees: s.employees || "",
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
          .filter((p: any) => p.product)
          .map((p: any) => ({
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

      movement: {
        create: movement
          .filter((m: Movement) => m.nameOutside || m.nameInside)
          .map((m: Movement) => ({
            nameOutside: m.nameOutside || "",
            nameInside: m.nameInside || "",
            weight: m.weight || "",
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
      movement: true,
      writeOff: true,
    },
  });

  updateTag("reportCucina");
  await invalidateEverywhere("reportCucina");

  return report.id;
}

// get by id
export async function getReportCucinaById(id: string) {
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
  return report;
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
      movement: true,
      writeOff: true,
    },
  });
  updateTag("reportCucina");
  await invalidateEverywhere("reportCucina");
}

// get all
export async function _getReportsCucina() {
  const reports = await prisma.dailyReportCucina.findMany({
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
  });

  return reports;
}
export const getReportsCucina = unstable_cache(
  _getReportsCucina,
  ["reportCucina"],
  {
    revalidate: false,
    tags: ["reportCucina"],
  }
);

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
      movement: true,
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
