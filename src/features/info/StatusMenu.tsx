"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoogleData } from "@/hooks/useGoogleData";

export default function StatusMenu() {
  const columns = [
    { key: "platinum", title: "Platinum" },
    { key: "gold", title: "Gold" },
    { key: "silver", title: "Silver" },
    { key: "loyal", title: "Loyal" },
  ] as const;
  const { statusMenu: data } = useGoogleData();
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 w-full">
      {columns.map((col) => (
        <Card key={col.key} className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-center">{col.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1 text-sm">
              {data &&
                data[col.key].map((item, idx) => (
                  <li
                    key={idx}
                    className={
                      item === "-" || item.trim() === ""
                        ? "text-gray-400 italic"
                        : ""
                    }
                  >
                    {item === "" ? <span>&nbsp;</span> : item}
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
