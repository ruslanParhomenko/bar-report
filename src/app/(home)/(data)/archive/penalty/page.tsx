// import {
//   getRemarksByUniqueKey,
//   RemarksDataByUniqueKey,
// } from "@/app/actions/remarks/remarks-action";
// import PenaltyDetails from "@/features/penalty/penalty-details";

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

//   return <PenaltyDetails data={remarks} />;
// }
