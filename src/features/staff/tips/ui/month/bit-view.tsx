import { TipsForm } from "@/features/staff/tips/model/schema";

export default function BidView({ data }: { data: TipsForm }) {
  return (
    <div className="mb-2 hidden justify-end gap-6 px-4 pb-4 md:flex">
      <span className="text-xs">barmen-dish__{data.barmenDishBid}</span>
      <span className="text-xs">dish-dish__{data.dishDishBid}</span>
      <span className="text-xs">waiters-dish__{data.waitersDishBid}</span>
      <span className="text-xs">waiters-percent__{data.percentTips}</span>
      <span className="text-xs">barmen-percent__{data.percentBarmen}</span>
      <span className="text-xs">dish-percent__{data.percentDish}</span>
    </div>
  );
}
