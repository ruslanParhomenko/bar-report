import PageNav from "@/features/nav/PageNav";
import { ORDER_TTN_NAV_ITEMS } from "@/features/navigation/constants";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageNav navItems={ORDER_TTN_NAV_ITEMS} mainRoute={"orders-list-ttn"} />
      {children}
    </>
  );
};

export default OrderLayout;
