import { getDataProducts } from "@/features/setting/actions/get-data-json";
import { ReportCucinaPage } from "@/features/staff/cucina/ui/report-cucina-page";

export default async function Page() {
  const dataProducts = await getDataProducts();

  return <ReportCucinaPage dataProducts={dataProducts} />;
}
