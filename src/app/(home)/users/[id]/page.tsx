import AddUsersCard from "@/features/users/AddUser";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return null;
  return <AddUsersCard id={id as string} />;
}
