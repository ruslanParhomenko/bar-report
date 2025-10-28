"use server";

import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";

// create break list
export async function createBreakList(data: any) {
  console.log(data);
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

  revalidateTag("archive");

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
  revalidateTag("archive");
}
