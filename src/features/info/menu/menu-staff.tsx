import { Menu } from "@/app/actions/google/google-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { menu } from "./constants";

const MENU_STAFF_BY_DAY = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export default function StaffMenu({ data }: { data: Menu | null }) {
  const menuStaffDaily = data && data.staff;
  const selectData = data && data.menuDepartament;
  return (
    <div className="grid h-[90vh] grid-cols-1 gap-4 px-1 md:grid-cols-4">
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Reception \ FM
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {selectData?.map((item, idx) => (
              <div key={idx} className="text-center">
                <Label className="text-bl py-4 font-bold">{item.product}</Label>
                {item?.description.map((item, idx) => (
                  <Label
                    key={idx}
                    className="text-muted-foreground py-1 text-center"
                  >
                    - {item}
                  </Label>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Security</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {menu?.map((item, idx) => (
              <div key={idx} className="text-center">
                <Label className="text-bl py-4 font-bold">{item.product}</Label>
                <Label className="text-muted-foreground py-1 text-center">
                  - 2 шт
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Personal</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-1 text-sm">
            {menu?.map((item, idx) => (
              <div key={idx} className="text-center">
                <Label className="text-bl py-4 font-bold">{item.product}</Label>
                <Label className="text-muted-foreground py-1 text-center">
                  - 1 шт {item.product === "Сэндвич" ? " -- смена 12 ч" : ""}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-transparent">
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
                    ) : null,
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
