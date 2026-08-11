import { UserFormPage } from "@/features/settings/users";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) return null;

  return <UserFormPage id={id} />;
}
