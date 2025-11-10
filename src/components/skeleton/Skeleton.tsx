"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function SkeletonSchedule() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const rows = Array.from({ length: 10 }); // 10 сотрудников для примера

  return (
    <div className="space-y-4">
      {/* Верхняя панель */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {/* Разделы */}
          <div className="flex gap-4 font-medium text-muted-foreground">
            <Skeleton className="h-5 w-12" /> {/* Кухня */}
            <Skeleton className="h-5 w-10" /> {/* Бар */}
            <Skeleton className="h-5 w-20" /> {/* Стюардинг */}
          </div>

          {/* Дата */}
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Печать
          </Button>
          <Button variant="outline" disabled>
            ✉️
          </Button>
        </div>
      </div>

      {/* Таблица */}
      <Card>
        <CardContent className="p-2 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="w-8"></th>
                <th className="w-8"></th>
                <th className="w-32 text-left">Сотрудник</th>
                <th className="w-16 text-center">ЗП</th>
                {days.map((day) => (
                  <th key={day} className="text-center w-8">
                    <Skeleton className="h-4 w-4 mx-auto" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((_, i) => (
                <tr key={i} className="border-t">
                  <td>
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-6 mx-auto" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td>
                    <Skeleton className="h-4 w-10 mx-auto" />
                  </td>
                  {days.map((day) => (
                    <td key={day} className="text-center">
                      <Skeleton className="h-4 w-6 mx-auto" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Нижний блок — итоги по часам */}
      <div className="flex justify-center gap-1 mt-2 flex-wrap">
        {Array.from({ length: 24 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-6 rounded-sm" />
        ))}
      </div>
    </div>
  );
}
