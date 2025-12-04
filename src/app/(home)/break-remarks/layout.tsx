import NavMenuBreakRemark from "@/features/break-remarks/NavMenuBreakRemark";

export default function LayoutBreakRemarks({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavMenuBreakRemark />
      {children}
    </>
  );
}
