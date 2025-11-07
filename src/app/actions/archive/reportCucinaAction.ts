"use server";
import { Movement, Remain, Shift, Staff, WriteOff } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

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
    ...(preparedSalads || []),
    ...(preparedSeconds || []),
    ...(preparedDesserts || []),
    ...(cutting || []),
  ];
  const report = await prisma.dailyReportCucina.create({
    data: {
      date: new Date(date),
      notes: notes || null,

      shifts: {
        create: shifts.map((s: Shift) => ({
          name: s.name,
          time: s.time,
          over: s.over,
          employees: s.employees,
        })),
      },

      remains: {
        create: remains.map((r: Remain) => ({
          product: r.product,
          portions: r.portions,
          weight: r.weight,
        })),
      },

      prepared: {
        create: prepared.map(
          (p: { product: any; portions: any; weight: any; time: any }) => ({
            product: p.product,
            portions: p.portions,
            weight: p.weight,
            time: p.time,
          })
        ),
      },

      staff: {
        create: staff.map((s: Staff) => ({
          product: s.product,
          portions: s.portions,
          weight: s.weight,
          time: s.time,
        })),
      },

      movement: {
        create: movement.map((m: Movement) => ({
          nameOutside: m.nameOutside,
          nameInside: m.nameInside,
          weight: m.weight,
        })),
      },

      writeOff: {
        create: writeOff.map((w: WriteOff) => ({
          product: w.product,
          weight: w.weight,
          reason: w.reason,
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

  revalidateTag("archive");
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
  revalidateTag("archive");
}
