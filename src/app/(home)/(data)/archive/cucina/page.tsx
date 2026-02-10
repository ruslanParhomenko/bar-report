// import { getReportCucinaByUniqueKey } from "@/app/actions/report-cucina/report-cucina-action";
// import ReportCucinaTable from "@/components/table/report-cucina-table/ReportCucinaTable";

// export default async function Page({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string | undefined }>;
// }) {
//   const { month, year } = await searchParams;
//   if (!month || !year) return null;

//   const uniqueKey = `${year}-${month}`;

//   const dataReportCucina = await getReportCucinaByUniqueKey(uniqueKey);

//   return <ReportCucinaTable data={dataReportCucina} />;
// }
