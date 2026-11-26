import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { INFO_MAIN_ROUTE } from "@/constants/route-tag";
import {
  DataPriceList,
  DataStatusParameters,
} from "@/features/setting/model/type";
import { requireTabAccess } from "@/lib/access";
import StatusMenu from "./menu-status";
import { PriceListBarTable, PriceListCucinaTable } from "./price-list-table";

type InfoPageProps = {
  priceList: DataPriceList | null;
  dataStatusParameters: DataStatusParameters | null;
  tab: string;
};

export default async function InfoPage({
  priceList,
  dataStatusParameters,
  tab,
}: InfoPageProps) {
  const { user } = await requireTabAccess(INFO_MAIN_ROUTE, tab);

  if (!user) {
    return <InsufficientRights />;
  }
  return (
    <>
      {tab === "statusMenu" && <StatusMenu data={dataStatusParameters} />}

      {tab === "price-list-bar" && <PriceListBarTable data={priceList} />}
      {tab === "price-list-cucina" && <PriceListCucinaTable data={priceList} />}
    </>
  );
}
