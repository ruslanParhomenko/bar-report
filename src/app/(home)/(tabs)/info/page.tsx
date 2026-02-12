import {
  getMenu,
  getStandardKitchen,
} from "@/app/actions/google/googleSheetAction";
import InfoPage from "@/features/info/info-page";

export default async function Page() {
  const [standardKitchen, menu] = await Promise.all([
    await getStandardKitchen(),
    await getMenu(),
  ]);

  return <InfoPage data={{ standardKitchen, menu }} />;
}
