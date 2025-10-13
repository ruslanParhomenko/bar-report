import { getArchive, invalidateArchive } from "@/app/actions/getArchive";
import { ArchivePage } from "@/features/archive/ArchiveForm";

export const revalidate = 43200;
export const fetchCache = "force-cache";

export default async function Page() {
  const data = await getArchive();
  return (
    <ArchivePage
      data={data}
      onInvalidate={async () => {
        "use server";
        await invalidateArchive();
      }}
    />
  );
}
