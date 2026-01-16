import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { OrderListTTNBar } from "@/features/orders/orderListBarTTN";
import { checkAccess } from "@/lib/check-access";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const SET_ACCESS = ["ADMIN", "BAR"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return (
    <OrderListTelegramForm user="barTTN" url="ttn">
      <OrderListTTNBar />
    </OrderListTelegramForm>
  );
}
