// import { getReportByUniqueKey } from "@/app/actions/report-bar/report-bar-action";
// import ReportBarTable from "@/components/table/report-bar-table/ReportBarTable";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//   const { month, year } = await searchParams;
//   if (!month || !year) return null;

//   const uniqueKey = `${year}-${month}`;

//   // get data
//   const dataReportBar = await getReportByUniqueKey(uniqueKey);

//   return <ReportBarTable data={dataReportBar} />;
// }
