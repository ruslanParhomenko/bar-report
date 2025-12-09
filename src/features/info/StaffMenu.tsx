import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { menu } from "./constants";
import { Menu } from "@/app/actions/google/googleSheetAction";

const MENU_STAFF_BY_DAY = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function StaffMenu({ data }: { data: Menu }) {
  const menuStaffDaily = data && data.staff;
  const selectData = data && data.menuDepartament;
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[90vh]">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Reception \ FM
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {selectData?.map((item, idx) => (
              <div key={idx} className="text-center">
                <Label className="font-bold text-bl py-4">{item.product}</Label>
                {item?.description.map((item, idx) => (
                  <Label
                    key={idx}
                    className="text-center text-muted-foreground py-1"
                  >
                    - {item}
                  </Label>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Security</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {menu?.map((item, idx) => (
              <div key={idx} className="text-center">
                <Label className="font-bold text-bl py-4">{item.product}</Label>
                <Label className="text-center text-muted-foreground py-1">
                  - 2 шт
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Personal</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {menu?.map((item, idx) => (
              <div key={idx} className="text-center">
                <Label className="font-bold text-bl py-4">{item.product}</Label>
                <Label className="text-center text-muted-foreground py-1">
                  - 1 шт {item.product === "Сэндвич" ? " -- смена 12 ч" : ""}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Daily</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-4 text-sm">
            {MENU_STAFF_BY_DAY.map((day) => {
              const key = day.toLowerCase();
              const list =
                menuStaffDaily?.[key as keyof typeof menuStaffDaily] ?? [];

              return (
                <div key={day}>
                  <Label className="text-bl">{day}</Label>

                  {list.map((menu, idx) =>
                    menu ? (
                      <div className="pl-2" key={idx}>
                        {menu}
                      </div>
                    ) : null
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
