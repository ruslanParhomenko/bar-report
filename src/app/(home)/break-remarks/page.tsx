import { Spinner } from "@/components/ui/spinner";

export default async function Page() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <Spinner className="w-12 h-12" />
    </div>
  );
}
