import { OrderListTTNBar } from "@/features/order-list/orderListBarTTN";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const Page = () => {
  return (
    <OrderListTelegramForm user="barTTN" url="ttn">
      <OrderListTTNBar />
    </OrderListTelegramForm>
  );
};

export default Page;
