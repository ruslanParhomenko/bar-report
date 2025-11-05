import { getArchive } from "@/app/actions/archive/getArchive";
import { ArchivePage } from "@/features/archive/ArchiveForm";

export default async function Page() {
  const data = await getArchive();
  return <ArchivePage data={data} />;
}
