import PageNav from "@/features/nav/PageNav";
import { INFO_ORDER_LIST } from "@/features/navigation/constants";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PageNav navItems={INFO_ORDER_LIST} mainRoute={"info"} />
      {children}
    </>
  );
};

export default OrderLayout;
