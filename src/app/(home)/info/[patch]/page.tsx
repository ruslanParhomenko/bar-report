import dynamic from "next/dynamic";
import {
  getMenu,
  getStandardKitchen,
} from "@/app/actions/google/googleSheetAction";
import { MenuDaily } from "@/features/info/MenuDaily";
import { MenuVip } from "@/features/info/MenuVip";

const StandardKitchenTable = dynamic(
  () => import("@/features/info/StandardKitchenTable")
);
const StatusMenu = dynamic(() => import("@/features/info/StatusMenu"));
const StaffMenu = dynamic(() => import("@/features/info/StaffMenu"));

const RENDER_COMPONENTS = {
  standardKitchen: StandardKitchenTable,
  statusMenu: StatusMenu,
  staffMenu: StaffMenu,
  "daily-menu": MenuDaily,
  menuVip: MenuVip,
} as const;

const GET_DATA = {
  standardKitchen: getStandardKitchen,
  statusMenu: getMenu,
  staffMenu: getMenu,
  "daily-menu": getMenu,
  menuVip: getMenu,
} as const;

export default async function InfoPage({
  params,
}: {
  params: Promise<{ patch: string }>;
}) {
  const { patch } = await params;
  const Component = RENDER_COMPONENTS[patch as keyof typeof RENDER_COMPONENTS];
  const getDataFn = GET_DATA[patch as keyof typeof GET_DATA];

  if (!Component || !getDataFn)
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  const data = await getDataFn();

  return <Component data={data as any} />;
}
