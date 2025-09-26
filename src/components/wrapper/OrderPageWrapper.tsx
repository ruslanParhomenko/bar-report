export default function OrderPageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 w-full justify-start md:mx-5 sm:flex-row">
      {children}
    </div>
  );
}
