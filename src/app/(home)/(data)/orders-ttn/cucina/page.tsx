import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { OrderListTTNCucina } from "@/features/orders/orderListCucinaTTN";
import { checkAccess } from "@/lib/check-access";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const SET_ACCESS = ["ADMIN", "CUCINA"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return (
    <OrderListTelegramForm user="cucinaTTN" url="ttn">
      <OrderListTTNCucina />
    </OrderListTelegramForm>
  );
}
