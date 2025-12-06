import { OrderListCucina } from "@/features/orders/OrderListCucinaZN";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const Page = () => {
  return (
    <OrderListTelegramForm user="cucinaZN" url="zn">
      <OrderListCucina />
    </OrderListTelegramForm>
  );
};

export default Page;
