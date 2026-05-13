import { UsersPage } from "@/features/users/users-page";
import { headers } from "next/headers";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const { filter } = await searchParams;

  const headerStore = await headers();
  const isAdmin = headerStore.get("x-is-admin") === "true";
  return <UsersPage isAdmin={isAdmin} filter={filter} />;
}
