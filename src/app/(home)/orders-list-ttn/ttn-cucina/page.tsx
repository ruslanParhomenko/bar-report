import { OrderListTTNCucine } from "@/features/order-list/orderListCucinaTTN";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const Page = () => {
  return (
    <OrderListTelegramForm user="cucinaTTN" url="ttn">
      <OrderListTTNCucine />
    </OrderListTelegramForm>
  );
};

export default Page;
