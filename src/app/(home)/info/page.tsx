import {
  getMenuCached,
  getStandardKitchenCached,
} from "@/app/actions/google/google-action";
import { getStopList } from "@/app/actions/stop-list/stop-list-action";
import { INFO_MAIN_ROUTE } from "@/constants/endpoint-tag";
import { SIDEBAR_NAVIGATION } from "@/constants/sidebar-nav";
import InfoPage from "@/features/info/info-page";

const SET_ACCESS =
  SIDEBAR_NAVIGATION.find((item) => item.title === INFO_MAIN_ROUTE)?.setAcces ||
  [];

import { checkAccess } from "@/lib/check-access";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
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
