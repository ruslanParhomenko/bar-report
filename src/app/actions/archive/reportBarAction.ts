"use server";
import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";

// create report
export async function createReportBar({ data }: { data: any }) {
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
        create: cashVerify.map((c: any) => ({
          hours: c.hours,
          value: c.value,
        })),
      },
      tobacco: {
        create: tobacco.map((t: any) => ({
          name: t.name,
          stock: t.stock,
          incoming: t.incoming,
          outgoing: t.outgoing,
          finalStock: t.finalStock,
        })),
      },
      expenses: {
        create: expenses.map((e: any) => ({
          name: e.name,
          sum: e.sum,
          time: e.time,
        })),
      },
      productTransfer: {
        create: productTransfer.map((p: any) => ({
          name: p.name,
          quantity: p.quantity,
          destination: p.destination,
          time: p.time,
        })),
      },
      inventory: {
        create: inventory.map((i: any) => ({
          name: i.name,
          quantity: i.quantity,
          time: i.time,
        })),
      },
      notes: notes.length > 0 ? notes : null,
    },
    include: {
      cashVerify: true,
      tobacco: true,
      expenses: true,
      productTransfer: true,
      inventory: true,
    },
  });

  revalidateTag("reportBar", "default");

  return report.id;
}

// update report

export async function updateReportBar({ data }: { data: any }) {
  const reportId = Number(data.id);
  if (isNaN(reportId)) throw new Error("Invalid report id");
  const {
    date,
    notes,
    cashVerify = [],
    expenses = [],
    tobacco = [],
    productTransfer = [],
    inventory = [],
  } = data;

  const updatedReport = await prisma.$transaction(async (tx) => {
    // Удаляем старые данные, связанные с отчётом
    await Promise.all([
      tx.cashVerify.deleteMany({ where: { reportId } }),
      tx.expense.deleteMany({ where: { reportId } }),
      tx.tobacco.deleteMany({ where: { reportId } }),
      tx.productTransfer.deleteMany({ where: { reportId } }),
      tx.inventory.deleteMany({ where: { reportId } }),
    ]);

    // Обновляем сам отчёт + пересоздаём связи
    const report = await tx.dailyReport.update({
      where: { id: reportId },
      data: {
        date: date ? new Date(date) : undefined,
        notes: notes?.length ? notes : null,
        cashVerify: {
          create: cashVerify.map((item: any) => ({
            hours: item.hours || "",
            value: item.value || "",
          })),
        },
        expenses: {
          create: expenses.map((item: any) => ({
            name: item.name || "",
            sum: item.sum || "",
          })),
        },
        tobacco: {
          create: tobacco.map((item: any) => ({
            name: item.name || "",
            stock: Number(item.stock) || 0,
            incoming: Number(item.incoming) || 0,
            outgoing: Number(item.outgoing) || 0,
            finalStock: item.finalStock || "",
          })),
        },
        productTransfer: {
          create: productTransfer.map((item: any) => ({
            name: item.name || "",
            quantity: item.quantity || "",
            destination: item.destination || "",
          })),
        },
        inventory: {
          create: inventory.map((item: any) => ({
            name: item.name || "",
            quantity: item.quantity || "",
          })),
        },
      },
      include: {
        cashVerify: true,
        expenses: true,
        tobacco: true,
        productTransfer: true,
        inventory: true,
      },
    });

    return report;
  });

  // Очистка кеша
  revalidateTag("reportBar", "default");

  return updatedReport;
}

// delete report
export async function deleteReportBar(id: string) {
  await prisma.dailyReport.delete({
    where: { id: Number(id) },
  });
  revalidateTag("reportBar", "default");
}

// get by id

export async function getReportBar(id: string) {
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
  ["reportBar-by-date"],
  {
    revalidate: false,
    tags: ["reportBar"],
  }
);
