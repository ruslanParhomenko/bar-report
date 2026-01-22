"use server";

import { unstable_cache, updateTag } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";
import { ReportBarFormValues } from "@/features/report/bar/schema";
import prisma from "@/lib/prisma";
import {
  CashVerify,
  DailyReport,
  Expense,
  Inventory,
  ProductTransfer,
  Tobacco,
} from "@/prisma/generated/prisma/client";
export type ReportBarType = DailyReport & {
  cashVerify: CashVerify[];
  tobacco: Tobacco[];
  expenses: Expense[];
  productTransfer: ProductTransfer[];
  inventory: Inventory[];
  notes: string;
};
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
  },
);
