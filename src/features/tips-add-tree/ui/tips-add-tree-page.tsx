"use client";
import ModalConfirm from "@/components/modal/modal-confirm";
import { makeDeleteTips } from "@/features/tips-add-tree/actions/make-delete-tips";
import { Amount } from "@/features/tips-add/model/schema";
import { GetTipsAddData } from "@/features/tips-add/model/type";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Result = { value: number; uniqueId: string };
type Entry = {
  employeeName: string;
  idEmployee: string;
  role: string;
  shift: string;
  amount?: Amount[];
  resultAmount?: Result[];
};
type Recipient = { name: string; value: number };

const short = (n: string) => {
  const [a, b] = n.split(" ");
  return b ? `${a} ${b[0]}.` : a;
};

export function TipsAddTreePage({
  data,
  isAdmin,
}: {
  data: GetTipsAddData | null;
  isAdmin: boolean;
}) {
  const entries = useMemo<Entry[]>(
    () => ((data?.tipsAdd ?? []) as unknown as Entry[]).filter(Boolean),
    [data],
  );

  const searchParams = useSearchParams();
  const monthUrl = searchParams.get("month");
  const yearUrl = searchParams.get("year");
  const dayUrl = searchParams.get("day");

  const [open, setOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [descriptionText, setDescriptionText] = useState<string>("");
  const [uniqueId, setUniqueId] = useState<string>("");
  const [idEmployee, setIdEmployee] = useState<string>("");

  const recipientsById = useMemo(() => {
    const map = new Map<string, Recipient[]>();
    for (const e of entries) {
      for (const r of e.resultAmount ?? []) {
        const list = map.get(r.uniqueId) ?? [];
        list.push({ name: e.employeeName, value: r.value });
        map.set(r.uniqueId, list);
      }
    }
    return map;
  }, [entries]);

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-center text-red-500">
        not found
      </div>
    );
  }

  const participants = entries.filter((e) => (e.amount?.length ?? 0) > 0);

  const handleConfirm = async () => {
    if (!dayUrl || !monthUrl || !yearUrl) {
      return console.error("Missing date parameters");
    }
    const result = await makeDeleteTips(
      uniqueId,
      idEmployee,
      dayUrl,
      monthUrl,
      yearUrl,
    );

    setSelectedEmployee("");
    setDescriptionText("");
    setUniqueId("");
    setIdEmployee("");
    setOpen(false);
    toast.success("Чаевые удалены");
  };

  if (!participants.length) {
    return (
      <div className="text-muted-foreground flex h-full items-center justify-center">
        нет чаевых
      </div>
    );
  }

  return (
    <>
      <ModalConfirm
        open={open}
        setOpen={setOpen}
        handleConfirm={handleConfirm}
        dialogText={"Удалить чаевые?" + " " + selectedEmployee}
        descriptionText={descriptionText}
      />
      <div className="flex h-full min-h-0 w-full flex-col overflow-hidden p-2">
        <h1 className="mb-2 shrink-0 text-center text-xs font-semibold">
          currency: {data.currency}
        </h1>

        <div className="grid min-h-0 flex-1 auto-rows-min grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] content-start gap-2 overflow-auto">
          {participants.map((p, i) => {
            const rows = [...(p.amount ?? [])].sort(
              (a, b) => Number(a.uniqueId) - Number(b.uniqueId),
            );

            return (
              <div
                key={i}
                className={cn(
                  "flex min-w-0 flex-col gap-2 overflow-hidden rounded-md border p-2",
                  participants?.length < 7 ? "max-h-[86dvh]" : "max-h-[43dvh]",
                )}
              >
                <div className="text-bl border-b px-1 pb-1 text-center text-sm font-semibold">
                  {p.employeeName}
                  <div className="text-muted-foreground text-[10px] font-normal">
                    {p.role} · {p.shift}
                  </div>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto">
                  <div className="flex flex-col gap-1.5">
                    {rows.map((a) => {
                      const recs = recipientsById.get(a.uniqueId) ?? [];

                      return (
                        <div
                          key={a.uniqueId}
                          className="group flex min-w-0 cursor-pointer items-center"
                          onClick={() =>
                            isAdmin &&
                            (setUniqueId(a.uniqueId),
                            setIdEmployee(p.idEmployee),
                            setSelectedEmployee(p.employeeName),
                            setDescriptionText(
                              a.time +
                                " " +
                                a.value.toString() +
                                " " +
                                a.typeAmount,
                            ),
                            setOpen(true))
                          }
                        >
                          <div
                            className={cn(
                              "relative w-10 shrink-0 px-1 py-0.5 text-[12px] leading-tight",
                              a.typeAmount === "mdl" ? "text-gn" : "text-rd",
                            )}
                          >
                            <div
                              className={cn(
                                a.isDeleted === true && "opacity-40",
                              )}
                            >
                              <div className="font-semibold">
                                {a.value}
                                <span className="text-muted-foreground pl-1 text-[9px]">
                                  {a.typeAmount}
                                </span>
                              </div>
                              <div className="text-muted-foreground group-hover:text-rd">
                                {a.time}
                              </div>
                            </div>

                            {a.isDeleted === true && (
                              <X
                                className="text-rd pointer-events-none absolute inset-0 m-auto h-full w-full bg-transparent"
                                strokeWidth={1.5}
                              />
                            )}
                          </div>

                          <div className="bg-border h-px w-4 shrink-0" />

                          <div className="border-border group-hover:text-rd group-hover:border-y-rd grid min-w-0 flex-1 grid-cols-2 gap-x-3 border-y px-1 py-1 text-[11px] leading-tight">
                            {recs.length === 0 && (
                              <span className="text-muted-foreground">—</span>
                            )}
                            {recs.map((r, k) => (
                              <div
                                key={k}
                                className="flex justify-between gap-1"
                              >
                                <span className="truncate">
                                  {short(r.name)}
                                </span>
                                <span className="tabular-nums">{r.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
