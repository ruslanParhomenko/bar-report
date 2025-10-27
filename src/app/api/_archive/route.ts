// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export const revalidate = 43200;

// export async function GET() {
//   const [dailyReportCucina, dailyReport, remarkReport, breakList] =
//     await prisma.$transaction([
//       prisma.dailyReportCucina.findMany({
//         take: 62,
//         include: {
//           shifts: true,
//           remains: true,
//           prepared: true,
//           staff: true,
//           movement: true,
//           writeOff: true,
//         },
//         orderBy: { date: "desc" },
//       }),
//       prisma.dailyReport.findMany({
//         take: 62,
//         include: {
//           cashVerify: true,
//           tobacco: true,
//           expenses: true,
//           productTransfer: true,
//           inventory: true,
//         },
//         orderBy: { date: "desc" },
//       }),
//       prisma.remarkReport.findMany({
//         take: 62,
//         include: { remarks: true },
//         orderBy: { date: "desc" },
//       }),
//       prisma.breakList.findMany({
//         take: 62,
//         include: {
//           rows: true,
//         },
//         orderBy: { date: "desc" },
//       }),
//     ]);

//   return NextResponse.json(
//     { dailyReportCucina, dailyReport, remarkReport, breakList },
//     {
//       headers: {
//         "Cache-Control": "s-maxage=43200, stale-while-revalidate=59",
//       },
//     }
//   );
// }
