import { ProtectedPage } from "@/components/wrapper/protected-page";
import { ALGORITHM_MAIN_ROUTE } from "@/constants/endpoint-tag";
import AlgorithmPage from "@/features/algorithm/algorithm-page";

export default async function Page() {
  return (
    <ProtectedPage route={ALGORITHM_MAIN_ROUTE}>
      <AlgorithmPage />
    </ProtectedPage>
  );
}
