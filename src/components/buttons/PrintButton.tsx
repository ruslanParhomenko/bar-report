import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PrintButton({
  onPrint,
  className,
}: {
  onPrint: () => void;
  className?: string;
}) {
  const t = useTranslations("Home");

  return (
    <Button
      size={"sm"}
      variant="outline"
      onClick={onPrint}
      className={cn(
        "flex items-center gap-2 print:hidden  cursor-pointer hover:bg-bl hover:text-white",
        className
      )}
    >
      <Printer className="w-4 h-4" />
      {t("print")}
    </Button>
  );
}
