"use client";

import { SaleByDay } from "@/features/parser-1c/xls-parser/xls-parser-page";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function DailyIssueChart({ data }: { data: SaleByDay[] }) {
  const [selectedDay, setSelectedDay] = useState<SaleByDay | null>(null);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="min-h-64 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 24, right: 16, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              opacity={0.3}
            />

            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
            />

            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              width={30}
            />

            <Tooltip
              cursor={{ fill: "var(--muted)", opacity: 0.35 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;

                const item = payload[0].payload as SaleByDay;

                return (
                  <div className="bg-popover text-popover-foreground border-border overflow-y-auto rounded-md border p-3 text-xs shadow-md">
                    <p className="mb-2 font-semibold">{item.day}</p>

                    <p className="mb-2">
                      Количество выдач:{" "}
                      <span className="font-semibold">{item.value}</span>
                    </p>

                    <div className="border-border border-t pt-2">
                      <p className="mb-1 font-medium">Время выдачи:</p>

                      <div className="flex flex-col gap-1">
                        {item.times.map((time, index) => (
                          <span
                            key={`${time}-${index}`}
                            className="bg-muted rounded px-1.5 py-0.5 tabular-nums"
                          >
                            {time}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Bar
              dataKey="value"
              name="Количество выдач"
              fill="var(--color-gn)"
              radius={[4, 4, 0, 0]}
              maxBarSize={36}
              cursor="pointer"
              onClick={(_, index) => {
                const item = data[index];

                if (!item) return;

                setSelectedDay((current) =>
                  current?.day === item.day ? null : item,
                );
              }}
            >
              <LabelList
                dataKey="value"
                position="top"
                offset={6}
                fill="currentColor"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="text-gn px-3">
        {selectedDay ? (
          <>
            <div className="flex items-center justify-between gap-3 border-b px-4">
              <div className="flex flex-row items-center gap-2">
                <h3 className="font-semibold">{selectedDay.day}</h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="text-rd hover:text-foreground text-xs"
              >
                Сбросить
              </button>
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-2 px-4 py-1">
              <span className="text-muted-foreground shrink-0 text-sm">
                Время выдачи: {selectedDay.value} единиц
              </span>

              {selectedDay.times.map((time, index) => (
                <span
                  key={`${time}-${index}`}
                  className="bg-muted rounded px-2 py-1 font-mono text-sm tabular-nums"
                >
                  {time}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground px-4 py-5 text-center text-sm">
            Нажмите на столбец графика, чтобы посмотреть время всех выдач за
            день.
          </p>
        )}
      </div>
    </div>
  );
}
