import {
  CHEMICALS,
  FRUITS,
  GROCERIES,
  MISCELLANEOUS,
  OFFICE,
  PHARMACEUTICAL,
} from "./constants";
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { OrderCardWrapper } from "@/components/wrapper/OrderCardWrapper";
import OrderPageWrapper from "@/components/wrapper/OrderPageWrapper";
export const OrderListBar = () => {
  return (
    <OrderPageWrapper>
      <InputWrapper>
        <OrderCardWrapper data={FRUITS} name="FRUITS" />
        <OrderCardWrapper data={GROCERIES} name="GROCERIES" />
        <OrderCardWrapper data={MISCELLANEOUS} name="MISCELLANEOUS" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={PHARMACEUTICAL} name="PHARMACEUTICAL" />
        <OrderCardWrapper data={OFFICE} name="OFFICE" />
        <OrderCardWrapper data={CHEMICALS} name="CHEMICALS" />
      </InputWrapper>
    </OrderPageWrapper>
  );
};
