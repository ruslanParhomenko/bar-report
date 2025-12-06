import { OrderListTTNCucina } from "@/features/orders/orderListCucinaTTN";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const Page = () => {
  return (
    <OrderListTelegramForm user="cucinaTTN" url="ttn">
      <OrderListTTNCucina />
    </OrderListTelegramForm>
  );
};

export default Page;
