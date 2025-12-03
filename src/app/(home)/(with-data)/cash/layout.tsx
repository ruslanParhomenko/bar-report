import NavMenuCash from "@/features/cash/NavMenuCash";

export default function LayoutCash({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuCash />
      {children}
    </>
  );
}
