import { getDataProducts } from "@/app/actions/data-constants/data-products-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { REPORTS_CUCINA_ROUTE } from "@/constants/endpoint-tag";
import ReportCucinaForm from "@/features/cucina/report-cucina-form";
import { checkAccess } from "@/lib/check-access";

export default async function Page() {
  const hasAccess = await checkAccess(REPORTS_CUCINA_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  const data = await getDataProducts();

  if (!data) return null;

  return <ReportCucinaForm dataProducts={data ?? []} />;
}
