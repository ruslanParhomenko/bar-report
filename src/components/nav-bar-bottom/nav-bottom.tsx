"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { RefContext } from "@/providers/client-ref-provider";
import { Printer } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useContext, useTransition } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

export default function NavBottom() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isMobile = useIsMobile();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const STORAGE_KEY = `nav-tab-${pathname}`;

  const ref = useContext(RefContext);

  const handlePrint = useReactToPrint({
    contentRef: ref as any,
    pageStyle: `
  @page {
    size: A4 landscape; 
    margin: 4mm;
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
    }

    .no-print {
      display: none !important;
    }
    .print-area {
      page-break-inside: avoid !important;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
    }
    .print-card {
      page-break-inside: avoid !important;
      flex: 1 1 22%; 
      min-width: 22%;
    }
  }
`,
    onAfterPrint: () => toast.success("Печать завершена"),
    onPrintError: () => toast.error("Произошла ошибка при печати"),
  });

  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-100 flex items-center justify-center gap-1 py-1 md:flex-row md:justify-between md:gap-2 md:px-4",
      )}
    >
      <button
        onClick={() => {
          if (!ref) return;
          handlePrint();
        }}
        type="button"
        className={cn("cursor-pointer print:hidden")}
      >
        <Printer
          size={20}
          className={cn("text-bl hover:text-black")}
          strokeWidth={1.5}
        />
      </button>
    </div>
  );
}
