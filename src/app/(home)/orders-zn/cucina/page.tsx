import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { OrderListCucina } from "@/features/orders/OrderListCucinaZN";
import { authOptions } from "@/lib/auth";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "CUCINA"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  return (
    <OrderListTelegramForm user="cucinaZN" url="zn">
      <OrderListCucina />
    </OrderListTelegramForm>
  );
}
