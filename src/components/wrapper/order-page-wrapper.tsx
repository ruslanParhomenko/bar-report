export default function OrderPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8 w-full justify-start  sm:flex-row">
      {children}
    </div>
  );
}
