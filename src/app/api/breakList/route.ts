import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { date, rows, remarks } = body;

  // Фильтруем rows, оставляя только те, у которых есть name
  const rowsWithName = rows.filter(
    (row: any) => row.name && row.name.trim() !== ""
  );

  const breakeList = await prisma.breakeList.create({
    data: {
      date: new Date(date),
      rows: {
        create: rowsWithName.map((row: any) => {
          // Создаем базовый объект для строки
          const rowData: any = {
            externalId: row.id,
            name: row.name,
          };

          // Проходим по всем часам из объекта hours и фильтруем значения
          if (row.hours && typeof row.hours === "object") {
            Object.entries(row.hours).forEach(([hour, value]) => {
              // Фильтруем: пропускаем пустые значения и "X"
              if (!value || value === "X" || value === "x") {
                return; // пропускаем эту итерацию
              }

              // Формируем имя поля, например, 'h_9' для часа '9'
              const fieldName = `h_${hour}`;
              // Присваиваем значение полю
              rowData[fieldName] = String(value);
            });
          }

          return rowData;
        }),
      },
      remarks: {
        create: remarks.map((remark: any) => ({
          name: remark.name,
          dayHours: remark.dayHours,
          nightHours: remark.nightHours,
          reason: remark.reason,
          penality: remark.penality,
          reasonPenality: remark.reasonPenality,
        })),
      },
    },
    include: {
      rows: true,
      remarks: true,
    },
  });

  return NextResponse.json(breakeList);
}

export async function GET() {
  const breakeList = await prisma.breakeList.findMany();
  return NextResponse.json(breakeList);
}
