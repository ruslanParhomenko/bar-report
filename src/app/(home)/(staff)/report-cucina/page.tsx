import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";
import { getDataProducts } from "@/features/settings/setting/actions/get-data-json";
import { ReportCucinaPage } from "@/features/staff/cucina/ui/report-cucina-page";

export default async function Page() {
  const [dataProducts, employees] = await Promise.all([
    getDataProducts(),
    getEmployees(),
  ]);

  if (!dataProducts || !employees) return null;

  return <ReportCucinaPage dataProducts={dataProducts} employees={employees} />;
}
