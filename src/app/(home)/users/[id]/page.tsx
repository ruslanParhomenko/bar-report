import UsersForm from "@/features/users/users-form";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;
  return <UsersForm id={id as string} />;
}
