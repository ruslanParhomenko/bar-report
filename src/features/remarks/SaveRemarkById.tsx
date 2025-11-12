import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/navigation";

export function SaveRemarkById() {
  const router = useRouter();
  return (
    <div>
      <Button type="submit" className="mt-4">
        Save
      </Button>
      <Button
        type="button"
        variant={"destructive"}
        className="mt-4 ml-4"
        onClick={() => router.back()}
      >
        return
      </Button>
    </div>
  );
}
