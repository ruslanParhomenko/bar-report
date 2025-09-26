import {
  BAKERY,
  FRUITS_CUISINE,
  GREEN,
  MEAT,
  MILK,
  NUTS,
  OTHER,
  SPICES,
  SPICES_2,
  VEGETABLES,
} from "./constants";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { OrderCardWrapper } from "@/components/wrapper/OrderCardWrapper";
import OrderPageWrapper from "@/components/wrapper/OrderPageWrapper";
export const OrderListCuisine = () => {
  return (
    <OrderPageWrapper>
      <InputWrapper>
        <OrderCardWrapper data={VEGETABLES} name="VEGETABLES" />
        <OrderCardWrapper data={GREEN} name="GREEN" />
        <OrderCardWrapper data={MILK} name="MILK" />
        <OrderCardWrapper data={NUTS} name="NUTS" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={FRUITS_CUISINE} name="FRUITS_CUISINE" />
        <OrderCardWrapper data={SPICES} name="SPICES" />
        <OrderCardWrapper data={BAKERY} name="BAKERY" />
        <OrderCardWrapper data={OTHER} name="OTHER" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={MEAT} name="MEAT" />
        <OrderCardWrapper data={SPICES_2} name="SPICES_2" />
      </InputWrapper>
    </OrderPageWrapper>
  );
};
