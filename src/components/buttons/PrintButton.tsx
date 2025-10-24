import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import { Printer } from "lucide-react";

export default function PrintButton({ onPrint }: { onPrint: () => void }) {
  const t = useTranslations("Home");

  return (
    <Button
      size={"sm"}
      variant="outline"
      onClick={onPrint}
      className="flex items-center gap-2 print:hidden  cursor-pointer hover:bg-bl hover:text-white"
    >
      <Printer className="w-4 h-4" />
      {t("print")}
    </Button>
  );
}
