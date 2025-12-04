"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag, unstable_cache } from "next/cache";

// create break list
export async function createBreakList(data: any) {
  const { date, rows } = data;
  const rowsWithName = rows.filter(
    (row: any) => row.name && row.name.trim() !== ""
  );

  const breakList = await prisma.breakList.create({
    data: {
      date: new Date(date),
      rows: {
        create: rowsWithName.map((row: any) => {
          const rowData: any = {
            externalId: row.id,
            name: row.name,
          };

          if (row.hours && typeof row.hours === "object") {
            Object.entries(row.hours).forEach(([hour, value]) => {
              if (!value || value === "X" || value === "x") {
                return;
              }
              const fieldName = `h_${hour}`;
              rowData[fieldName] = String(value);
            });
          }

          return rowData;
        }),
      },
    },
    include: {
      rows: true,
    },
  });

  revalidateTag("breakList");

  return breakList.id;
}

// get by id

export async function getBreakListById(id: string) {
  const report = await prisma.breakList.findUnique({
    where: { id: Number(id) },
    include: { rows: true },
  });
  return report;
}

// delete
export async function deleteBreakList(id: string) {
  await prisma.breakList.delete({
    where: { id: Number(id) },
  });
  revalidateTag("breakList");
}

// get all
export async function _getBreakList() {
  const data = prisma.breakList.findMany({
    take: 62,
    include: { rows: true },
    orderBy: { date: "desc" },
  });
  return data;
}

export const getBreakList = unstable_cache(_getBreakList, ["breakList"], {
  revalidate: false,
  tags: ["breakList"],
});

// get by date
export async function _getBreakListByDate({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const breakList = await prisma.breakList.findMany({
    where: {
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: { rows: true },
    orderBy: { date: "desc" },
  });

  return { breakList };
}

export const getBreakListByDate = unstable_cache(
  _getBreakListByDate,
  ["breakList-by-date"],
  {
    revalidate: false,
    tags: ["breakList"],
  }
);
