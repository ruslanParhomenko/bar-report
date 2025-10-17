import PrintButton from "@/components/buttons/PrintButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleData } from "@/hooks/useGoogleData";
import { usePrint } from "@/hooks/useToPrint";

export default function StatusMenu() {
  const columns = [
    { key: "platinum", title: "Platinum" },
    { key: "gold", title: "Gold" },
    { key: "silver", title: "Silver" },
    { key: "loyal", title: "Loyal" },
  ] as const;
  const { statusMenu: data } = useGoogleData();
  const label = [
    "Безалкогольная продукция",
    "Завтраки и десерты",
    "Салаты и закуски",
    "Вторые блюда",
    "Снеки ",
  ];
  const { componentRef, handlePrint } = usePrint({ title: "Table status" });
  return (
    <>
      <PrintButton onPrint={handlePrint} />
      <div
        ref={componentRef}
        className="flex flex-col md:flex-row md:flex-wrap gap-4 w-full  print:h-[200mm]"
      >
        {columns.map((col) => (
          <Card
            key={col.key}
            className="rounded-2xl shadow-sm md:flex-1 md:min-w-[23%]"
          >
            <CardHeader>
              <CardTitle className="text-center font-bold text-md">
                {col.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                {data &&
                  data[col.key].map((item, idx) => (
                    <li
                      key={idx}
                      className={
                        label.includes(item)
                          ? "font-bold text-bl text-center pb-1"
                          : "truncate"
                      }
                    >
                      {item === "-" ? <span> .</span> : item}
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
