import {
  ROGOB,
  BLUESHARK,
  FRUITBOX_C,
  DINOVA,
  IUG,
  PRESTAPAC,
  IMCOMVIL,
  ARTACULINAR,
  ETALONUS,
  VITAFOR,
  FORWARD_CUCINE,
  DELPHI,
  FRUITBOX,
  BUCURIA_CUCINA,
} from "./constants";
import { InputWrapper } from "@/components/wrapper/input-wrapper";
import { OrderCardWrapper } from "@/components/wrapper/order-card-wrapper";
import OrderPageWrapper from "@/components/wrapper/order-page-wrapper";
export const OrderListTTNCucina = () => {
  return (
    <OrderPageWrapper>
      <InputWrapper>
        <OrderCardWrapper data={ROGOB} name="ROGOB" />
        <OrderCardWrapper data={BLUESHARK} name="BLUESHARK" />
        <OrderCardWrapper data={VITAFOR} name="VITAFOR" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={ARTACULINAR} name="ARTACULINAR" />
        <OrderCardWrapper data={PRESTAPAC} name="PRESTAPAC" />
        <OrderCardWrapper data={IMCOMVIL} name="IMCOMVIL" />
        <OrderCardWrapper data={ETALONUS} name="ETALONUS" />
        <OrderCardWrapper data={FORWARD_CUCINE} name="FORWARD_CUCINE" />
        <OrderCardWrapper data={DELPHI} name="DELPHI" />
        <OrderCardWrapper data={BUCURIA_CUCINA} name="BUCURIA_CUCINA" />
      </InputWrapper>
      <InputWrapper>
        <OrderCardWrapper data={DINOVA} name="DINOVA" />
        <OrderCardWrapper data={IUG} name="IUG" />
        <OrderCardWrapper data={FRUITBOX} name="FRUITBOX" />
        <OrderCardWrapper data={FRUITBOX_C} name="FRUITBOX_C" />
      </InputWrapper>
    </OrderPageWrapper>
  );
};
