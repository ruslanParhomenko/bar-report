import OrdersPage from "@/features/orders/orders-page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { tab } = await searchParams;
  return <OrdersPage tab={tab} />;
}
