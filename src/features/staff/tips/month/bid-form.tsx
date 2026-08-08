import { useFormContext } from "react-hook-form";
import { TipsForm } from "../schema";

export default function BidForm({ disabled = true }: { disabled: boolean }) {
  const form = useFormContext<TipsForm>();
  return (
    <div className="mb-2 hidden justify-end pb-4 md:flex">
      <span className="text-xs">
        barmen-dish:
        <input
          {...form.register("barmenDishBid")}
          className="text-bl ml-2 w-10 text-xs"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        dish-dish:
        <input
          {...form.register("dishDishBid")}
          className="text-bl ml-2 w-10 text-xs"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        waiters-dish:
        <input
          {...form.register("waitersDishBid")}
          className="text-bl ml-2 w-10 text-xs"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        waiters-percent:
        <input
          {...form.register("percentTips")}
          className="text-bl ml-2 w-10 text-xs"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        barmen-percent:
        <input
          {...form.register("percentBarmen")}
          className="text-bl ml-2 w-10 text-xs"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        dish-percent:
        <input
          {...form.register("percentDish")}
          className="text-bl ml-2 w-10 text-xs"
          disabled={disabled}
        ></input>
      </span>
    </div>
  );
}
