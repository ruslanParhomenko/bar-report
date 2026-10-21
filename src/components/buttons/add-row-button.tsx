import AppTooltip from "@/components/ui/app-tooltip";
import { ListPlus } from "lucide-react";

export default function AddRowButton({ addNewRow }: { addNewRow: () => void }) {
  return (
    <AppTooltip
      content="Добавить строку"
      render={
        <button
          type="button"
          onClick={() => addNewRow()}
          className="flex cursor-pointer items-center justify-center rounded-md px-2 py-1.5 hover:text-black"
        />
      }
    >
      <ListPlus size={16} className="text-green-600" strokeWidth={2} />
    </AppTooltip>
  );
}
