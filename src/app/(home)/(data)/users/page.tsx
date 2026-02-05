import { getUsers } from "@/app/actions/users/userAction";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import UsersPage from "@/features/users/users-page";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  const users = await getUsers();
  return <UsersPage users={users} />;
}
