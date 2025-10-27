// import { getArchive, invalidateArchive } from "@/app/actions/getArchive";
import {
  getArchive,
  invalidateArchive,
} from "@/app/actions/archive/getArchive";
import { ArchivePage } from "@/features/archive/ArchiveForm";

// export const revalidate = false;
// export const fetchCache = "force-cache";

export default async function Page() {
  const data = await getArchive();
  return <ArchivePage data={data} onInvalidate={invalidateArchive} />;
}
