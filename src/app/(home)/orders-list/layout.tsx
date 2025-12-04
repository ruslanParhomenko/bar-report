import PageNav from "@/features/nav/PageNav";
import { ORDER_NAV_ITEMS } from "@/features/navigation/constants";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageNav navItems={ORDER_NAV_ITEMS} mainRoute={"orders-list"} />
      {children}
    </>
  );
};

export default OrderLayout;
