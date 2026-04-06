import { getDataProducts } from "@/app/actions/data-constants/data-products-action";

import ReportCucinaForm from "@/features/cucina/report-cucina-form";
import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import { REPORTS_CUCINA_ROUTE } from "@/constants/endpoint-tag";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === REPORTS_CUCINA_ROUTE)
    ?.setAcces || [];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const data = await getDataProducts();

  if (!data) return null;

  return <ReportCucinaForm dataProducts={data ?? []} />;
}
