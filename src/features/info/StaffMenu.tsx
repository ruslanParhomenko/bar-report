"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useGoogleData } from "@/hooks/useGoogleData";
import { menu } from "./constants";

export default function StaffMenu() {
  const { menuDepartments: data } = useGoogleData();

  const dataSecuruty = menu;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Reteption \ FM
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {data ? (
              data.map((item, idx) => (
                <div key={idx} className="text-center">
                  <Label className="font-bold text-bl py-4">
                    {item.product}
                  </Label>
                  {item?.description.map((item, idx) => (
                    <Label
                      key={idx}
                      className="text-center text-muted-foreground py-1"
                    >
                      - {item}
                    </Label>
                  ))}
                </div>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Security</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {dataSecuruty ? (
              dataSecuruty?.map((item, idx) => (
                <div key={idx} className="text-center">
                  <Label className="font-bold text-bl py-4">
                    {item.product}
                  </Label>
                  <Label className="text-center text-muted-foreground py-1">
                    - 2 шт
                  </Label>
                </div>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Personal</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {dataSecuruty ? (
              dataSecuruty?.map((item, idx) => (
                <div key={idx} className="text-center">
                  <Label className="font-bold text-bl py-4">
                    {item.product}
                  </Label>
                  <Label className="text-center text-muted-foreground py-1">
                    - 1 шт {item.product === "Сэндвич" ? " -- смена 12 ч" : ""}
                  </Label>
                </div>
              ))
            ) : (
              <Spinner />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
