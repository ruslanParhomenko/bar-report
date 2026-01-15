"use server";

import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import { invalidateEverywhere } from "../invalidateEverywhere/invalidateEverywhere";

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

  invalidateEverywhere("breakList");

  return breakList.id;
}

// delete
export async function deleteBreakList(id: string) {
  await prisma.breakList.delete({
    where: { id: Number(id) },
  });
  invalidateEverywhere("breakList");
}

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
  ["breakList"],
  {
    revalidate: false,
    tags: ["breakList"],
  }
);
