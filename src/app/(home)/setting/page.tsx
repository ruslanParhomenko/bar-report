import { getDataProducts } from "@/app/actions/data-products-prepare/data-products-action";
import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import SettingsForm from "@/features/setting/setting-form";
import { checkAccess } from "@/lib/check-access";
const SET_ACCESS = ["ADMIN"];

export default async function SettingsPage() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;

  const data = await getDataProducts();

  return (
    <div className="max-w-3xl mx-auto p-8">
      <SettingsForm defaultValue={JSON.stringify(data ?? [], null, 2)} />
    </div>
  );
}
