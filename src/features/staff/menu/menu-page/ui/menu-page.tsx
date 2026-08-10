"use client";
import { MenuDataType } from "@/app/actions/data-constants/data-menu-action";
import { useSearchParams } from "next/navigation";
import { MenuDailyPage } from "../../menu-daily";

import { MenuDailyForm } from "../../menu-daily/model/schema";
import { MenuVipPage } from "../../menu-vip";

type Props = {
  dataMenuVip: MenuDataType | null;
  dataMenuDaily: MenuDailyForm | null;
  listMenuDaily: MenuDailyForm | null;
};
export function MenuPage({ dataMenuVip, dataMenuDaily, listMenuDaily }: Props) {
  const tab = useSearchParams().get("tab");
  if (tab === "menu-daily") {
    return (
      <MenuDailyPage
        data={listMenuDaily}
        menuDaily={dataMenuDaily}
        qrUrl={dataMenuVip?.cover[0]?.qrUrl}
      />
    );
  }

  if (tab === "menu-vip") {
    return <MenuVipPage data={dataMenuVip} />;
  }

  return null;
}
