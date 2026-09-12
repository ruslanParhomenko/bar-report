import { getDataProducts } from "@/features/setting/actions/get-data-json";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { ReportCucinaPage } from "@/features/staff/cucina/ui/report-cucina-page";

export default async function Page() {
  const dataProducts = await getDataProducts();
  const employees = await getEmployees();

  return <ReportCucinaPage dataProducts={dataProducts} employees={employees} />;
}
