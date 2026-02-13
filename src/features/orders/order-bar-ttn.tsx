import {
  AQUATRADE,
  BUCURIA,
  BUISNESS,
  UBFB,
  COCACOLA,
  FORWARD,
  GLOBARSPIRIT,
  ACVILIN,
  ACVAMONT,
  VERGNANO,
  CHOCO,
  FRUITBOX,
  APIFERA,
  DAVIDAN,
  UBFB2,
  SAMPAREX,
} from "./constants";
import { InputWrapper } from "@/components/wrapper/input-wrapper";
import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";
import OrderPageWrapper from "@/components/wrapper/order-page-wrapper";

export const OrderListTTNBar = () => {
  return (
    <OrderPageWrapper>
      <InputWrapper>
        <OrderCardWrapper data={AQUATRADE} name="AQUATRADE" />
        <OrderCardWrapper data={BUCURIA} name="BUCURIA" />
        <OrderCardWrapper data={BUISNESS} name="BUISNESS" />
        <OrderCardWrapper data={VERGNANO} name="VERGNANO" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={ACVILIN} name="ACVILIN" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={COCACOLA} name="COCACOLA" />
        <OrderCardWrapper data={GLOBARSPIRIT} name="GLOBARSPIRIT" />
        <OrderCardWrapper data={ACVAMONT} name="ACVAMONT" />
        <OrderCardWrapper data={CHOCO} name="CHOCO" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={UBFB} name="UBFB" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={UBFB2} name="UBFB2" />
        <OrderCardWrapper data={FORWARD} name="FORWARD" />
        <OrderCardWrapper data={FRUITBOX} name="FRUITBOX" />
        <OrderCardWrapper data={SAMPAREX} name="SAMPAREX " />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={DAVIDAN} name="DAVIDAN" />
        <OrderCardWrapper data={APIFERA} name="APIFERA" />
      </InputWrapper>
    </OrderPageWrapper>
  );
};
