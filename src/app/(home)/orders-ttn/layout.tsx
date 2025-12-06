import NavMenuOrders from "@/features/orders/TabsMenuOrders";

const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavMenuOrders mainRoute={"orders-ttn"} />
      {children}
    </>
  );
};

export default OrderLayout;
