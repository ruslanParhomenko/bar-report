import {
  BAKERY,
  EMPTY,
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
import { InputWrapper } from "@/components/wrapper/input-wrapper";
import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";
import { OrderEmptyCardWrapper } from "@/components/wrapper/order-empty-card-wrapper";
import OrderPageWrapper from "@/components/wrapper/order-page-wrapper";
export const OrderListCucina = () => {
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
        <OrderEmptyCardWrapper data={EMPTY} name="EMPTY" />
      </InputWrapper>
    </OrderPageWrapper>
  );
};
