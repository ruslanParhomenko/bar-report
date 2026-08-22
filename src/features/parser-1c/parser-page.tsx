"use client";

import ExpParserPage from "@/features/parser-1c/exp-parser/exp-parser-page";
import XlsParserPage from "@/features/parser-1c/xls-parser/xls-parser-page";
import { useSearchParams } from "next/navigation";

export function ParserPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  if (tab === "exp") {
    return <ExpParserPage />;
  }
  if (tab === "xls") {
    return <XlsParserPage />;
  }
  return null;
}
