import { OrderListBar } from "@/features/orders/OrderListBarZN";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const Page = () => {
  return (
    <OrderListTelegramForm user="barZN" url="zn">
      <OrderListBar />
    </OrderListTelegramForm>
  );
};

export default Page;
