import { getArchive } from "@/app/actions/archive/getArchive";
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
  return <ArchivePage data={data} />;
}
