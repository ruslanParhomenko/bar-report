import { getDataBuffet } from "@/app/actions/data-constants/data-buffet-action";
import ConstructorChartBuffetPage from "@/features/constructor-chart/constructor-chart-buffet-page";

export default async function ConstructorChart() {
  const data = await getDataBuffet();

  if (!data)
    return (
      <div className="flex h-full w-full items-center justify-center">
        No data
      </div>
    );
  return <ConstructorChartBuffetPage data={data.data} />;
}
