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
import { InputWrapper } from "@/components/wrapper/InputWrapper";
import { OrderCardWrapper } from "@/components/wrapper/OrderCardWrapper";

export const OrderListTTNBar = () => {
  return (
    <div className="flex flex-col gap-6 w-full justify-start  sm:flex-row">
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
        <OrderCardWrapper data={DAVIDAN} name="DAVIDAN" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={UBFB} name="UBFB" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={UBFB2} name="UBFB2" />
        <OrderCardWrapper data={ACVAMONT} name="ACVAMONT" />
        <OrderCardWrapper data={CHOCO} name="CHOCO" />
        <OrderCardWrapper data={APIFERA} name="APIFERA" />
        <OrderCardWrapper data={FORWARD} name="FORWARD" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={FRUITBOX} name="FRUITBOX" />
        <OrderCardWrapper data={SAMPAREX} name="SAMPAREX " />
      </InputWrapper>
    </div>
  );
};
