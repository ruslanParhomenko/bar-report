import { Label } from "@/components/ui/label";
import { DataStatusParameters } from "@/features/setting/model/type";
import { COLUMNS_STATUS_PARAMETERS, LABELS } from "../model/constants";

export default function StatusMenu({
  data,
}: {
  data: DataStatusParameters | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
      {COLUMNS_STATUS_PARAMETERS.map((col, index) => {
        const dataCol = data?.[col];

        return (
          <div
            key={col}
            className={`flex flex-col space-y-2 ${index !== COLUMNS_STATUS_PARAMETERS.length - 1 ? "md:border-r md:border-gray-300 md:pr-3" : ""} `}
          >
            <span className="text-md w-full py-4 text-center font-bold">
              {col}
            </span>
            <ul className="space-y-1 text-sm">
              {LABELS.map((label, idx) => {
                const item = dataCol?.[label];
                console.log(item);
                return (
                  <ul key={idx}>
                    <Label className="text-bl block py-2 text-center font-bold">
                      {label}
                    </Label>
                    {item?.map((item, idx) => (
                      <li key={idx} className="truncate py-1 text-xs">
                        {item === "-" ? <span>.</span> : item}
                      </li>
                    ))}
                  </ul>
                );
              })}
            </ul>

            {/* <ul className="space-y-1 text-sm">
              {data?.[col].map((item, idx) => (
              <li
                key={idx}
                className={
                  LABELS.includes(item)
                    ? "text-bl pb-1 text-center font-bold"
                    : "truncate"
                }
              >
                {item === "-" ? <span>.</span> : item}
              </li>
            ))}
            </ul> */}
          </div>
        );
      })}
    </div>
  );
}
