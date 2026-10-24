import { ReportCucinaPage } from "@/features/cucina/ui/report-cucina-page";
import { getDataProducts } from "@/features/setting/actions/get-data-json";
import { getEmployees } from "@/features/settings/create-employee/actions/get-employees";

export default async function Page() {
  const [dataProducts, employees] = await Promise.allSettled([
    getDataProducts(),
    getEmployees(),
  ]);

  return (
    <ReportCucinaPage
      dataProducts={
        dataProducts.status === "fulfilled" ? dataProducts.value : null
      }
      employees={employees.status === "fulfilled" ? employees.value : []}
    />
  );
}
