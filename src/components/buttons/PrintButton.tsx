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

  const isMobile = window.innerWidth < 768;

  return (
    <Button
      size={"sm"}
      variant="outline"
      onClick={onPrint}
      type="button"
      className={cn(
        "flex items-center gap-2 print:hidden  cursor-pointer hover:bg-bl hover:text-white",
        className
      )}
    >
      <Printer className="w-4 h-4" />
      {!isMobile && t("print")}
    </Button>
  );
}
