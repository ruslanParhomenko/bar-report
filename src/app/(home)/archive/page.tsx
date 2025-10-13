import { getArchive, invalidateArchive } from "@/app/actions/getArchive";
import { ArchiveForm } from "@/features/archive/ArchiveForm";

export const revalidate = 43200;
export const fetchCache = "force-cache";

export default async function ArchivePage() {
  const data = await getArchive();
  return (
    <ArchiveForm
      data={data}
      onInvalidate={async () => {
        "use server";
        await invalidateArchive();
      }}
    />
  );
}
