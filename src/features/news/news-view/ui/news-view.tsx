import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { NewsData } from "@/features/news/news-edit/model/schema";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function NewsView({ data }: { data: NewsData | null }) {
  return (
    <Table className="mt-4">
      <TableBody>
        {data?.news.map((item, idx) => (
          <TableRow
            key={`${item.createdAt}-${idx}`}
            className="border-bl/50 border-b!"
          >
            <TableCell className="text-bl w-6">{idx + 1}</TableCell>

            <TableCell>
              <div className="grid grid-cols-[90%_5%_5%] items-center gap-0 text-xs!">
                <span className="text-gr min-w-0 wrap-break-word whitespace-normal">
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
                    {item.value}
                  </ReactMarkdown>
                </span>

                <span className="text-bl min-w-0 wrap-break-word whitespace-normal">
                  {item.createdAt}
                </span>

                <span className="min-w-0 wrap-break-word whitespace-normal">
                  {item.expiresAt}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
