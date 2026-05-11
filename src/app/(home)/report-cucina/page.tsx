import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import KitchenReportPage from "@/features/cucina/kitchen-report-page";

export default async function Page() {
  const data = await getDataProducts();

  if (!data) return null;

  return <KitchenReportPage dataProducts={data ?? []} />;
}
