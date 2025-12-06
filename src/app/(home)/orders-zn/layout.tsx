import NavMenuOrders from "@/features/orders/TabsMenuOrders";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavMenuOrders mainRoute={"orders-zn"} />
      {children}
    </>
  );
};

export default OrderLayout;
