import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useLocale } from "next-intl";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlgorithmData } from "../model/schema";

export default function AlgorithmTable({
  data,
}: {
  data: AlgorithmData[keyof AlgorithmData] | undefined;
}) {
  const locale = useLocale();
  return (
    <Table className="mt-4">
      <TableBody>
        {data?.map((item, idx) => {
          return (
            <TableRow key={`item-${idx}`}>
              <TableCell className="w-6 p-1.5">{idx + 1}</TableCell>

              <TableCell className="p-1">
                <span className="text-gr min-w-0 text-xs wrap-break-word whitespace-normal">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="mb-2 last:mb-0">{children}</p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-2 list-disc pl-5 text-left">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-2 list-decimal pl-5 text-left">
                          {children}
                        </ol>
                      ),
                    }}
                  >
                    {locale === "ro" ? item.valueRo : item.value}
                  </ReactMarkdown>
                </span>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
