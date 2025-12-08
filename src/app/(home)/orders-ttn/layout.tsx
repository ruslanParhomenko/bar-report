import NavMenuHeader from "@/components/nav-menu-header/NavMenuHeader";

const navItems = [
  { title: "bar", href: "bar" },
  { title: "cucina", href: "cucina" },
];
const OrderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavMenuHeader
        navItems={navItems}
        mainRoute="orders-ttn"
        filterType="none"
        resetButton={true}
      />
      {children}
    </>
  );
};

export default OrderLayout;
