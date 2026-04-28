"use client";
import { cn } from "@/lib/utils";
import { RefContext } from "@/providers/client-ref-provider";
import { Printer } from "lucide-react";
import { useContext } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export default function PrintButton({
  componentRef,
  className,
  disabled = false,
  size = 21,
}: {
  componentRef?: React.RefObject<HTMLDivElement | null> | null;
  className?: string;
  disabled?: boolean;
  size?: number;
}) {
  const ref = componentRef || useContext(RefContext);
  const handlePrint = useReactToPrint({
    contentRef: ref as any,
    pageStyle: `
  @page { size: A4 landscape;margin: 4mm; }
  @media print {
    body {-webkit-print-color-adjust: exact}
    .no-print {display: none !important}
  }
`,
    onAfterPrint: () => toast.success("Печать завершена"),
    onPrintError: () => toast.error("Произошла ошибка при печати"),
  });

  return (
    <button
      onClick={() => ref && handlePrint()}
      type="button"
      disabled={disabled}
      className={cn(className, "cursor-pointer print:hidden")}
    >
      <Printer
        size={size}
        className={cn("text-bl hover:text-black", disabled && "opacity-50")}
        strokeWidth={1.5}
      />
    </button>
  );
}
