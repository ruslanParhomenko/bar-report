// import { getBreakListByDate } from "@/app/actions/break/break-action";
// import { BreakListArchive } from "@/features/break/break-list-archive";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//   const { month, year } = await searchParams;
//   if (!month || !year) return null;
//   const uniqueKey = `${year}-${month}`;

//   // get data
//   const breakData = await getBreakListByDate(uniqueKey);

//   if (!breakData)
//     return (
//       <div className="text-bl flex justify-center h-[30vh] items-center">
//         not found data
//       </div>
//     );

//   return <BreakListArchive data={breakData} />;
// }
