import {
  CHEMICALS,
  FRUITS,
  GROCERIES,
  MISCELLANEOUS,
  OFFICE,
  PHARMACEUTICAL,
} from "./constants";
import { InputWrapper } from "@/components/wrapper/input-wrapper";
import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";
import OrderPageWrapper from "@/components/wrapper/order-page-wrapper";
export const OrderListBar = () => {
  return (
    <OrderPageWrapper>
      <InputWrapper>
        <OrderCardWrapper data={FRUITS} name="FRUITS" />
        <OrderCardWrapper data={MISCELLANEOUS} name="MISCELLANEOUS" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={PHARMACEUTICAL} name="PHARMACEUTICAL" />
        <OrderCardWrapper data={OFFICE} name="OFFICE" />
        <OrderCardWrapper data={CHEMICALS} name="CHEMICALS" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={GROCERIES} name="GROCERIES" />
      </InputWrapper>
    </OrderPageWrapper>
  );
};
