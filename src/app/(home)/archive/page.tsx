import { getArchive } from "@/app/actions/archive/getArchive";
import { Skeleton } from "@/components/ui/skeleton";
import { InsufficientRights } from "@/components/wrapper/InsufficientRights";
import { ArchivePage } from "@/features/archive/ArchiveForm";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const role = session?.user?.role;
  const data = await getArchive();

  if (role === "OBSERVER") return <InsufficientRights />;
  return data ? (
    <ArchivePage data={data} />
  ) : (
    <div className="space-y-3">
      <Skeleton className="h-8 w-1/3 rounded-lg" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}
