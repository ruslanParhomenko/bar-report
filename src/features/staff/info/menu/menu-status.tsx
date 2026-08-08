import { Menu } from "@/app/actions/google/google-action";
import { columns, LABELS } from "./constants";

export default function StatusMenu({ data }: { data: Menu | null }) {
  const selectData = data && data.statusMenu;

  return (
    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-4">
      {columns.map((col, index) => (
        <div
          key={col.key}
          className={`flex flex-col space-y-2 ${index !== columns.length - 1 ? "md:border-r md:border-gray-300 md:pr-3" : ""} `}
        >
          <span className="text-md w-full py-4 text-center font-bold">
            {col.title}
          </span>

          <ul className="space-y-1 text-sm">
            {selectData?.[col.key].map((item, idx) => (
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
          </ul>
        </div>
      ))}
    </div>
  );
}
