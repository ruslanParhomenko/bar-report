import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import { INFO_MAIN_ROUTE } from "@/constants/endpoint-tag";
import InfoPage from "@/features/info/info-page";
import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";

export default async function Page() {
  const hasAccess = await checkAccess(INFO_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;

  const [standardKitchenRes, menuRes, stopListRes] = await Promise.allSettled([
    getStandardKitchenCached(),
    getMenuCached(),
    getStopList(),
  ]);

  return (
    <InfoPage
      data={{
        standardKitchen:
          standardKitchenRes.status === "fulfilled"
            ? standardKitchenRes.value
            : null,
        menu: menuRes.status === "fulfilled" ? menuRes.value : null,
        stopList: stopListRes.status === "fulfilled" ? stopListRes.value : null,
      }}
    />
  );
}
