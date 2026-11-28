import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalculationCardType } from "@/features/tech-card/model/type";

type RecipeRow = {
  name: string;
  quantity: string | number;
  coefficient: string | number;
  unit: string;
  nameId: string;
};

const UNIT_LABEL: Record<string, string> = {
  kg: "кг",
  g: "г",
  l: "л",
  ml: "мл",
  pcs: "шт",
};

const unitLabel = (u?: string) => (u ? (UNIT_LABEL[u] ?? u) : "—");
const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(4) : "—");

export default function CardViewPage({
  dataCardById,
}: {
  dataCardById: CalculationCardType;
}) {
  const card = dataCardById as any;

  // в recipe могут попасть строки-заглушки — оставляем только объекты
  const rows: RecipeRow[] = (card?.recipe ?? []).filter(
    (r: unknown): r is RecipeRow => typeof r === "object" && r !== null,
  );
  const portions = Number(card?.portion) || 1;

  const params: [string, React.ReactNode][] = [
    ["Категория", <Badge variant="secondary">{card?.category || "—"}</Badge>],
    ["Порций", portions],
    ["Выход", unitLabel(card?.weight)],
    [
      "Срок хранения",
      card?.expirationPeriod ? `${card.expirationPeriod} ч` : "—",
    ],
  ];

  return (
    <div className="bg-muted min-h-screen py-6">
      <section className="bg-background text-foreground mx-auto flex min-h-[297mm] w-[210mm] max-w-full flex-col p-[14mm] shadow-xl">
        <header>
          <p className="text-muted-foreground text-[11px] tracking-[0.25em] uppercase">
            Калькуляционная карта
          </p>
          <h1 className="mt-1 text-2xl leading-tight font-bold capitalize">
            {card?.name || "Без названия"}
          </h1>
        </header>

        <Separator className="bg-foreground my-4" />

        <dl className="grid grid-cols-4 overflow-hidden rounded-lg border text-sm">
          {params.map(([label, value], i) => (
            <div
              key={label}
              className={i > 0 ? "border-l px-3 py-2" : "px-3 py-2"}
            >
              <dt className="text-muted-foreground text-[10px] tracking-wider uppercase">
                {label}
              </dt>
              <dd className="mt-1 font-semibold">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 overflow-hidden rounded-lg border">
          <Table className="text-[12px]">
            <TableHeader>
              <TableRow className="bg-muted/60 hover:bg-muted/60">
                <TableHead className="w-8 text-center">№</TableHead>
                <TableHead className="w-16">Код</TableHead>
                <TableHead>Ингредиент</TableHead>
                <TableHead className="w-12 text-center">Ед.</TableHead>
                <TableHead className="w-14 text-right">Коэфф.</TableHead>
                <TableHead className="w-24 text-right">Всего</TableHead>
                <TableHead className="w-24 text-right">На 1 порцию</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => {
                const coef = Number(r.coefficient) || 1;
                const total = Number(r.quantity) * coef;
                return (
                  <TableRow
                    key={`${r.nameId}-${i}`}
                    className="even:bg-muted/30"
                  >
                    <TableCell className="text-muted-foreground py-1.5 text-center">
                      {i + 1}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-1.5 font-mono text-[11px]">
                      {r.nameId}
                    </TableCell>
                    <TableCell className="py-1.5 font-medium capitalize">
                      {r.name}
                    </TableCell>
                    <TableCell className="py-1.5 text-center">
                      {unitLabel(r.unit)}
                    </TableCell>
                    <TableCell className="py-1.5 text-right tabular-nums">
                      {coef}
                    </TableCell>
                    <TableCell className="py-1.5 text-right font-semibold tabular-nums">
                      {fmt(total)}
                    </TableCell>
                    <TableCell className="text-muted-foreground py-1.5 text-right tabular-nums">
                      {fmt(total / portions)}
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-muted-foreground py-8 text-center"
                  >
                    Нет ингредиентов
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {card?.description && (
          <div className="mt-6">
            <h2 className="text-muted-foreground text-[10px] tracking-wider uppercase">
              Технология приготовления
            </h2>
            <p className="mt-1 text-sm leading-relaxed whitespace-pre-line">
              {card.description}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
