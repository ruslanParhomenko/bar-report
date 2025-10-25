import PrintButton from "@/components/buttons/PrintButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGoogleData } from "@/hooks/useGoogleData";
import { usePrint } from "@/hooks/useToPrint";
import { columns, LABELS } from "./constants";

export default function StatusMenu() {
  const { statusMenu: data } = useGoogleData();
  const { componentRef, handlePrint } = usePrint({ title: "Table status" });

  return (
    <>
      <PrintButton onPrint={handlePrint} className="mb-2" />
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
                {data ? (
                  data[col.key].map((item, idx) => (
                    <li
                      key={idx}
                      className={
                        LABELS.includes(item)
                          ? "font-bold text-bl text-center pb-1"
                          : "truncate"
                      }
                    >
                      {item === "-" ? <span> .</span> : item}
                    </li>
                  ))
                ) : (
                  <Spinner />
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
