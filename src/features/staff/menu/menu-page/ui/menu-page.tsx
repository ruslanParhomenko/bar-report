"use client";
import { useSearchParams } from "next/navigation";
import { MenuDailyPage } from "../../menu-daily";

import { DataMenu } from "@/features/settings/setting/model/type";
import { MenuDailyForm } from "../../menu-daily/model/schema";
import { MenuVipPage } from "../../menu-vip";

type Props = {
  dataMenuVip: DataMenu | null;
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
