import { InsufficientRights } from "@/components/wrapper/insufficient-rights";
import { ALGORITHM_MAIN_ROUTE } from "@/constants/endpoint-tag";
import AlgorithmPage from "@/features/algorithm/algorithm-page";
import { checkAccess } from "@/lib/check-access";

export default async function Page() {
  const hasAccess = await checkAccess(ALGORITHM_MAIN_ROUTE);
  if (!hasAccess) return <InsufficientRights />;
  return <AlgorithmPage />;
}
