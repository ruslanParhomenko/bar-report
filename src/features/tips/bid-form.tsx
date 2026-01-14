import { TipsFormType } from "./schema";
import { useFormContext } from "react-hook-form";

export default function BidForm({ disabled = true }: { disabled: boolean }) {
  const form = useFormContext<TipsFormType>();
  return (
    <div className="md:flex justify-end mb-2 hidden ">
      <span className="text-xs">
        barmen-dish:
        <input
          {...form.register("barmenDishBid")}
          className="w-10 text-xs text-bl ml-2"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        dish-dish:
        <input
          {...form.register("dishDishBid")}
          className="w-10 text-xs text-bl ml-2"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        waiters-dish:
        <input
          {...form.register("waitersDishBid")}
          className="w-10 text-xs text-bl ml-2"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        waiters-percent:
        <input
          {...form.register("percentTips")}
          className="w-10 text-xs text-bl ml-2"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        barmen-percent:
        <input
          {...form.register("percentBarmen")}
          className="w-10 text-xs text-bl ml-2"
          disabled={disabled}
        ></input>
      </span>
      <span className="text-xs">
        dish-percent:
        <input
          {...form.register("percentDish")}
          className="w-10 text-xs text-bl ml-2"
          disabled={disabled}
        ></input>
      </span>
    </div>
  );
}
