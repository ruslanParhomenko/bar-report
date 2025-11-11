import { OrderListCuisine } from "@/features/order-list/OrderListCucineZN";
import { OrderListTelegramForm } from "@/providers/SendTelegramForm";

const Page = () => {
  return (
    <OrderListTelegramForm user="cucinaZN" url="zn">
      <OrderListCuisine />
    </OrderListTelegramForm>
  );
};

export default Page;
