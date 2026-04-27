import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { REPORTS_CUCINA_ROUTE } from "@/constants/endpoint-tag";
import KitchenReportPage from "@/features/cucina/kitchen-report-page";

import { checkAccess } from "@/lib/check-access";

export default async function Page() {
  const hasAccess = await checkAccess(REPORTS_CUCINA_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  const data = await getDataProducts();

  if (!data) return null;

  return <KitchenReportPage dataProducts={data ?? []} />;
}
