import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { REPORTS_CUCINA_ROUTE } from "@/constants/endpoint-tag";
import KitchenReportPage from "@/features/cucina/kitchen-report-page";

export default async function Page() {
  const data = await getDataProducts();

  if (!data) return null;

  return (
    <ProtectedPage route={REPORTS_CUCINA_ROUTE}>
      <KitchenReportPage dataProducts={data ?? []} />
    </ProtectedPage>
  );
}
