import { CardViewPage } from "@/features/card-view";
import { getCardById } from "@/features/card-view/actions/get-card-by-id";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;

  const dataCardById = await getCardById(id);

  if (!dataCardById) return null;

  return <CardViewPage dataCardById={dataCardById} />;
}
