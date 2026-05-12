import { getAOByYear } from "@/app/actions/a-o/ao-action";
import AoPage from "@/features/a-o/ao-page";

type Params = PageProps<"/a-o">;

export default async function Page({ searchParams }: Params) {
  const { month, year, tab } = await searchParams;
  if (!month || !year || !tab) return null;

  const dataAoYear = await getAOByYear(year as string);

  return <AoPage dataAoYear={dataAoYear} tab={tab as string} />;
}
