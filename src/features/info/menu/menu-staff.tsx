import { Menu } from "@/app/actions/google/google-action";
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
  const menuStaffDaily = data?.staff;
  const selectData = data?.menuDepartament;

  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
      {/* Reception / FM */}
      <div className="flex flex-col space-y-3 md:border-r md:pr-3">
        <span className="text-md py-4 text-center font-bold">
          Reception / FM
        </span>

        <div className="space-y-6 text-sm">
          {selectData?.map((item, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <Label className="text-bl block pb-2 font-bold">
                {item.product}
              </Label>

              {item.description.map((desc, i) => (
                <div key={i} className="text-muted-foreground">
                  - {desc}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="flex flex-col space-y-6 md:border-r md:pr-3">
        <span className="text-md py-4 text-center font-bold">Security</span>

        <div className="space-y-3 text-sm">
          {menu.map((item, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <Label className="text-bl block pb-2 font-bold">
                {item.product}
              </Label>

              <div className="text-muted-foreground">- 2 шт</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal */}
      <div className="flex flex-col space-y-6 md:border-r md:pr-3">
        <span className="text-md py-4 text-center font-bold">Personal</span>

        <div className="space-y-3 text-sm">
          {menu.map((item, idx) => (
            <div key={idx} className="space-y-2 text-center">
              <Label className="text-bl block pb-2 font-bold">
                {item.product}
              </Label>

              <div className="text-muted-foreground">
                - 1 шт {item.product === "Сэндвич" && "-- смена 12 ч"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily */}
      <div className="flex flex-col space-y-3">
        <span className="text-md py-4 text-center font-bold">Daily</span>

        <div className="space-y-4 text-sm">
          {MENU_STAFF_BY_DAY.map((day) => {
            const key = day.toLowerCase();
            const list =
              menuStaffDaily?.[key as keyof typeof menuStaffDaily] ?? [];

            return (
              <div key={day}>
                <Label className="text-bl block text-center font-bold">
                  {day}
                </Label>

                {list.map((item, idx) =>
                  item ? (
                    <div key={idx} className="text-center">
                      {item}
                    </div>
                  ) : null,
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
