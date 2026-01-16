import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { OrderListCucina } from "@/features/orders/OrderListCucinaZN";
import { checkAccess } from "@/lib/check-access";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const SET_ACCESS = ["ADMIN", "CUCINA"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return (
    <OrderListTelegramForm user="cucinaZN" url="zn">
      <OrderListCucina />
    </OrderListTelegramForm>
  );
}
