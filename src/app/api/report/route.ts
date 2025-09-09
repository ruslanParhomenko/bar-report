import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { cashVerify, tobacco, expenses, date, productTransfer, notes } = body;
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
        })),
      },
      productTransfer: {
        create: productTransfer.map((p: any) => ({
          name: p.name,
          quantity: p.quantity,
          destination: p.destination,
        })),
      },
      notes: notes.length > 0 ? notes : null,
    },
    include: {
      cashVerify: true,
      tobacco: true,
      expenses: true,
      productTransfer: true,
    },
  });

  return NextResponse.json(report);
}

export async function GET() {
  const dailyReport = await prisma.dailyReport.findMany();
  return NextResponse.json(dailyReport);
}
