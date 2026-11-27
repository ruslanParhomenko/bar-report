import { ProductsPage } from "@/features/products";
import { getAllProducts } from "@/features/products/actions/get-all-products";
import { TechCardPage } from "@/features/tech-card";
import { getAllCards } from "@/features/tech-card/actions/get-all-card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;

  if (tab === "tech-card") {
    const dataCards = await getAllCards();
    return <TechCardPage data={dataCards} />;
  }

  if (tab === "products") {
    const dataProducts = await getAllProducts();
    return <ProductsPage data={dataProducts} />;
  }

  return null;
}
