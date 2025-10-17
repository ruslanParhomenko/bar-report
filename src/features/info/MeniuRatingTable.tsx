"use client";
import { FetchDataButton } from "@/components/buttons/FetchDataButton";
import { DatePickerRange } from "@/components/inputs/DatePickerRange";
import { Form } from "@/components/ui/form";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import { useForm, useWatch } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAbility } from "@/providers/AbilityProvider";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useDataSupaBase } from "@/hooks/useRealTimeData";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type InputData = {
  form_data: {
    date: string;
    user: string;
    [day: string]: any;
  };
  user_email: string;
};

type ResultItem = {
  item: string;
  ratings: number[];
};

export function sortData(data: InputData[]): ResultItem[] {
  const itemsMap: Record<string, number[]> = {};

  data.forEach((entry) => {
    const { form_data } = entry;

    Object.keys(form_data).forEach((key) => {
      if (
        [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ].includes(key)
      ) {
        const dayItems = form_data[key];

        dayItems.forEach((dish: { item: string; rating?: number }) => {
          if (!itemsMap[dish.item]) {
            itemsMap[dish.item] = [];
          }
          if (dish.rating !== undefined) {
            itemsMap[dish.item].push(dish.rating);
          }
        });
      }
    });
  });

  return Object.entries(itemsMap).map(([item, ratings]) => ({
    item,
    ratings,
  }));
}

function getRatingStats(ratings: number[]) {
  const count = ratings.length;
  const avg = count > 0 ? ratings.reduce((sum, r) => sum + r, 0) / count : 0;

  return {
    avg: Math.round(avg),
    count,
  };
}

export default function MeniuRatingTable() {
  const [selected, setSelected] = useState<string | null>(null);
  const { isObserver } = useAbility();
  const LOCAL_STORAGE_KEY = "meniu-staff";

  const { getValue, setValue: setLocalStorage } =
    useLocalStorageForm(LOCAL_STORAGE_KEY);

  const form = useForm<{ items: ResultItem[] }>({
    defaultValues: {
      items: [],
      ...(getValue() as any),
    },
  });

  const { fetchRealTimeMeniuStaff: fetchRealTime } = useDataSupaBase({
    localStorageKey: LOCAL_STORAGE_KEY,
    apiKey: "meniu-staff",
  });

  const fetchSupaBaseData = async () => {
    const data = await fetchRealTime();
    const resetData = sortData(data || []);
    if (resetData) {
      form.reset({ items: resetData });
      setLocalStorage({ items: resetData } as any);
    }
  };

  const items = useWatch({
    control: form.control,
    name: "items",
  });

  return (
    <Card className="rounded-2xl shadow-sm pt-2 px-10 h-screen flex flex-col">
      <FetchDataButton fetchData={fetchSupaBaseData} isDisabled={isObserver} />
      <CardHeader>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead className="text-center">avg</TableHead>
              <TableHead className="text-center">votes</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </CardHeader>

      <CardContent className="overflow-y-auto no-scrollbar">
        <Table className="table-fixed w-full">
          <TableBody>
            {items
              ?.filter((item) => item.item)
              .map((row, idx) => {
                const { avg, count } = getRatingStats(row.ratings);
                return (
                  <TableRow
                    key={idx}
                    onClick={() => {
                      setSelected(selected === row.item ? null : row.item);
                    }}
                    className={cn("cursor-pointer", {
                      "text-rd font-bold": selected === row.item,
                    })}
                  >
                    <TableCell>{row.item}</TableCell>
                    <TableCell className="text-center">{avg}</TableCell>
                    <TableCell className="text-center">{count}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
