import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import UsersForm from "@/features/users/users-form";
import { checkAccess } from "@/lib/check-access";

const SET_ACCESS = ["ADMIN"];

export default async function Page() {
  const hasAccess = await checkAccess(SET_ACCESS);
  if (!hasAccess) return <InsufficientRights />;
  return <UsersForm />;
}
