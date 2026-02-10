// import {
//   getRemarksByUniqueKey,
//   RemarksDataByUniqueKey,
// } from "@/app/actions/remarks/remarks-action";
// import PenaltyGeneral from "@/features/penalty/penalty-general";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//   const { month, year } = await searchParams;
//   if (!month || !year) return null;
//   const uniqueKey = `${year}-${month}`;

//   const remarks = (await getRemarksByUniqueKey(
//     uniqueKey,
//   )) as RemarksDataByUniqueKey;

//   return <PenaltyGeneral data={remarks} />;
// }
