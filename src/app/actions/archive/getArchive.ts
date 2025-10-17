// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidateTag } from "next/cache";
// import { cache } from "react";

// export const getArchive = cache(async () => {
//   const [dailyReportCucina, dailyReport, remarkReport, breakeList] =
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
//       prisma.breakeList.findMany({
//         take: 62,
//         include: { rows: true },
//         orderBy: { date: "desc" },
//       }),
//     ]);

//   return {
//     dailyReportCucina,
//     dailyReport,
//     remarkReport,
//     breakeList,
//     cache: { tags: ["archive"] },
//   };
// });

// export async function invalidateArchive() {
//   revalidateTag("archive");
// }
