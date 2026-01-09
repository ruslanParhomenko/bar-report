import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { OrderListBar } from "@/features/orders/OrderListBarZN";
import { authOptions } from "@/lib/auth";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const SET_ACCESS = ["ADMIN", "BAR", "CUCINA"];

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (!SET_ACCESS.includes(session?.user?.role as string))
    return <InsufficientRights />;
  return (
    <OrderListTelegramForm user="barZN" url="zn">
      <OrderListBar />
    </OrderListTelegramForm>
  );
}
