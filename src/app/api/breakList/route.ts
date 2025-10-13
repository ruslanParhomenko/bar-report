import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { date, rows } = body;
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

  return NextResponse.json(breakList);
}

export async function GET() {
  const breakList = await prisma.breakList.findMany();
  return NextResponse.json(breakList);
}
