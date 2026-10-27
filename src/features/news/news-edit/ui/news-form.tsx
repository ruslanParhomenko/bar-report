"use client";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import {
  defaultValuesNews,
  NewsData,
} from "@/features/news/news-edit/model/schema";
import { cn } from "@/lib/utils";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";

export default function NewsForm({
  fieldArray,
}: {
  fieldArray: UseFieldArrayReturn<NewsData, "news", "id">;
}) {
  const { fields, append, remove, replace } = fieldArray;
  const { register } = useFormContext<NewsData>();

  const handleRemove = (idx: number) => {
    fields.length === 1 ? replace([defaultValuesNews]) : remove(idx);
  };

  return (
    <Table className="mt-4">
      <TableBody>
        {fields.map((item, idx) => {
          const isLast = idx === fields.length - 1;

          return (
            <TableRow key={item.id}>
              <TableCell className="w-6">{idx + 1}</TableCell>

              <TableCell className="p-1">
                <div className="grid grid-cols-[80%_10%_10%] items-center gap-2">
                  <TextareaAutosize
                    {...register(`news.${idx}.value` as const)}
                    placeholder="Новость"
                    className={cn(
                      "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 dark:bg-input/30 flex w-full rounded-md border bg-transparent p-1 shadow-xs outline-none focus-visible:ring-[3px]",
                      "bg-background! min-h-1 resize-none border-0 text-xs! shadow-none",
                    )}
                  />

                  <Input
                    {...register(`news.${idx}.createdAt` as const)}
                    placeholder="Создана"
                    className="h-7 border-0 bg-transparent px-1 text-[10px] shadow-none"
                    aria-label="Дата создания"
                  />

                  <Input
                    {...register(`news.${idx}.expiresAt` as const)}
                    placeholder="Окончание"
                    className="h-7 border-0 bg-transparent px-1 text-[10px] shadow-none"
                    aria-label="Дата окончания"
                  />
                </div>
              </TableCell>

              <TableCell className="w-14">
                <div className="flex gap-6 px-6">
                  {isLast && (
                    <button
                      type="button"
                      onClick={() => append({ ...defaultValuesNews })}
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  )}

                  <button type="button" onClick={() => handleRemove(idx)}>
                    <Trash2Icon className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
