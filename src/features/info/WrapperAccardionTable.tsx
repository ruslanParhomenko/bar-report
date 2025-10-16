import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export function WrapperAccordionTable({
  children,
  nameTag,
  className,
}: {
  children: React.ReactNode;
  nameTag?: string;
  className?: string;
}) {
  const t = useTranslations("Home");
  return (
    <Accordion type="single" collapsible className="py-2">
      <AccordionItem value={nameTag ?? ""}>
        <AccordionTrigger className="text-base bg-bl cursor-pointer w-full px-4 py-2 hover:no-underline hover:text-amber-50">
          {t(nameTag ?? "")}
        </AccordionTrigger>
        <AccordionContent>
          <div className={cn("w-full p-4", className)}>{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
