import {
  getMenu,
  getStandardKitchen,
} from "@/app/actions/google/googleSheetAction";
import { getStopList } from "@/app/actions/stop-list/stopListAction";
import InfoPage from "@/features/info/info-page";

export default async function Page() {
  const [standardKitchen, menu, stopList] = await Promise.all([
    await getStandardKitchen(),
    await getMenu(),
    await getStopList(),
  ]);

  return <InfoPage data={{ standardKitchen, menu, stopList }} />;
}
