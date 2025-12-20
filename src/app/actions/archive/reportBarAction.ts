"use server";
import { prisma } from "@/lib/prisma";
import { unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { ReportBarFormValues } from "@/features/report/bar/schema";

// create report
export async function createReportBar({ data }: { data: ReportBarFormValues }) {
  const {
    cashVerify,
    tobacco,
    expenses,
    date,
    productTransfer,
    notes,
    inventory,
  } = data;

  const report = await prisma.dailyReport.create({
    data: {
      date: new Date(date),
      cashVerify: {
        create: cashVerify.map((c) => ({
          hours: c.hours,
          value: c.value,
        })),
      },
      tobacco: {
        create: tobacco.map((t) => ({
          name: t.name,
          stock: t.stock,
          incoming: t.incoming,
          outgoing: t.outgoing,
          finalStock: t.finalStock,
        })),
      },
      expenses: {
        create: expenses.map((e) => ({
          name: e.name,
          sum: e.sum,
          time: e.time,
        })),
      },
      productTransfer: {
        create: productTransfer.map((p) => ({
          name: p.name,
          quantity: p.quantity,
          destination: p.destination,
          time: p.time,
        })),
      },
      inventory: {
        create: inventory.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          time: i.time,
        })),
      },
      notes: notes,
    },
    include: {
      cashVerify: true,
      tobacco: true,
      expenses: true,
      productTransfer: true,
      inventory: true,
    },
  });
  updateTag("reportBar");
  await invalidateEverywhere("reportBar");

  return report.id;
}

// delete report
export async function deleteReportBar(id: string) {
  await prisma.dailyReport.delete({
    where: { id: Number(id) },
  });
  updateTag("reportBar");
  await invalidateEverywhere("reportBar");
}

// get by id

export type ReportDataById = ReportBarFormValues & {
  id: number;
};

export async function getReportBar(id: number) {
  const report = await prisma.dailyReport.findUnique({
    where: { id: Number(id) },
    include: {
      cashVerify: true,
      tobacco: true,
      expenses: true,
      productTransfer: true,
      inventory: true,
    },
  });
  return report;
}

// get all

export async function _getReportsBar() {
  const reports = await prisma.dailyReport.findMany({
    take: 62,
    include: {
      cashVerify: true,
      tobacco: true,
      expenses: true,
      productTransfer: true,
      inventory: true,
    },
    orderBy: { date: "desc" },
  });

  return reports;
}
export const getReportsBar = unstable_cache(_getReportsBar, ["reportBar"], {
  revalidate: false,
  tags: ["reportBar"],
});

// get by date
export async function _getReportBarByDate({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const reports = await prisma.dailyReport.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      cashVerify: true,
      tobacco: true,
      expenses: true,
      productTransfer: true,
      inventory: true,
    },
    orderBy: { date: "desc" },
  });

  return { reports };
}

export const getReportBarByDate = unstable_cache(
  _getReportBarByDate,
  ["reportBar"],
  {
    revalidate: false,
    tags: ["reportBar"],
  }
);
