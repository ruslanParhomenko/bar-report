import { getAOByYear } from "@/app/actions/a-o/ao-action";
import { ProtectedPage } from "@/components/wrapper/protected-page";
import { AO_REPORT_MAIN_ROUTE } from "@/constants/endpoint-tag";
import AoPage from "@/features/a-o/ao-page";

type Params = PageProps<"/a-o">;

export default async function Page({ searchParams }: Params) {
  const { month, year } = await searchParams;
  if (!month || !year) return null;

  const dataAoYear = await getAOByYear(year as string);

  return (
    <ProtectedPage route={AO_REPORT_MAIN_ROUTE}>
      <AoPage dataAoYear={dataAoYear} />
    </ProtectedPage>
  );
}
