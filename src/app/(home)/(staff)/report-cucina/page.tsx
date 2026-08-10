import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { ReportCucinaPage } from "@/features/staff/cucina/ui/report-cucina-page";

export default async function Page() {
  const data = await getDataProducts();

  if (!data) return null;

  return <ReportCucinaPage dataProducts={data ?? []} />;
}
