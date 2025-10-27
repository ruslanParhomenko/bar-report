// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function DELETE(
//   _req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   try {
//     await prisma.dailyReport.delete({
//       where: { id: Number(id) },
//     });

//     return NextResponse.json({ message: "Deleted successfully" });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// //get

// export async function GET(
//   _req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;
//   const report = await prisma.dailyReport.findUnique({
//     where: { id: Number(id) },
//     include: {
//       cashVerify: true,
//       tobacco: true,
//       expenses: true,
//       productTransfer: true,
//       inventory: true,
//     },
//   });

//   return NextResponse.json(report);
// }

// //update
// export async function PUT(
//   req: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;
//     const data = await req.json();

//     const reportId = Number(id);
//     if (isNaN(reportId)) {
//       return NextResponse.json({ error: "Invalid report id" }, { status: 400 });
//     }

//     const updatedReport = await prisma.$transaction(async (tx) => {
//       await Promise.all([
//         tx.cashVerify.deleteMany({ where: { reportId } }),
//         tx.expense.deleteMany({ where: { reportId } }),
//         tx.tobacco.deleteMany({ where: { reportId } }),
//         tx.productTransfer.deleteMany({ where: { reportId } }),
//         tx.inventory.deleteMany({ where: { reportId } }),
//       ]);

//       const report = await tx.dailyReport.update({
//         where: { id: reportId },
//         data: {
//           date: data.date ? new Date(data.date) : undefined,
//           notes: data.notes ?? undefined,
//           cashVerify: {
//             create:
//               data.cashVerify?.map((item: any) => ({
//                 hours: item.hours || "",
//                 value: item.value || "",
//               })) || [],
//           },
//           expenses: {
//             create:
//               data.expenses?.map((item: any) => ({
//                 name: item.name || "",
//                 sum: item.sum || "",
//               })) || [],
//           },
//           tobacco: {
//             create:
//               data.tobacco?.map((item: any) => ({
//                 name: item.name || "",
//                 stock: Number(item.stock) ?? 0,
//                 incoming: Number(item.incoming) ?? 0,
//                 outgoing: Number(item.outgoing) ?? 0,
//                 finalStock: item.finalStock || "",
//               })) || [],
//           },
//           productTransfer: {
//             create:
//               data.productTransfer?.map((item: any) => ({
//                 name: item.name || "",
//                 quantity: item.quantity || "",
//                 destination: item.destination || "",
//               })) || [],
//           },
//           inventory: {
//             create:
//               data.inventory?.map((item: any) => ({
//                 name: item.name || "",
//                 quantity: item.quantity || "",
//               })) || [],
//           },
//         },
//         include: {
//           cashVerify: true,
//           expenses: true,
//           tobacco: true,
//           productTransfer: true,
//           inventory: true,
//         },
//       });

//       return report;
//     });

//     return NextResponse.json(updatedReport);
//   } catch (error) {
//     console.error("PUT /api/daily-reports/[id] error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to update daily report",
//         details: (error as any)?.message || String(error),
//       },
//       { status: 500 }
//     );
//   }
// }
