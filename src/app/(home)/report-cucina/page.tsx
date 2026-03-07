import { getDataProducts } from "@/app/actions/data-constants/data-products-action";

import ReportCucinaForm from "@/features/cucina/report-cucina-form";

export default async function Page() {
  const data = await getDataProducts();

  if (!data) return null;

  return <ReportCucinaForm dataProducts={data ?? []} />;
}
