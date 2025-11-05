import SelectField from "@/components/inputs/SelectField";
import TextInput from "@/components/inputs/TextInput";
import { MONTHS, YEAR } from "@/utils/getMonthDays";

export function ResultHeaderForm() {
    return (
        <div className="flex flex-col justify-between">
        <div className="flex gap-4 justify-start items-center">
          <SelectField
            fieldName="month"
            data={MONTHS}
            placeHolder="month"
            className="w-24 p-0 h-8!"
          />
          <SelectField
            fieldName="year"
            data={YEAR}
            placeHolder="year"
            className="w-20 p-0 h-8!"
          />
          <div className="flex gap-4 justify-start items-center">
            <TextInput fieldName="waitersDishBid" className="w-15 h-8" />
            <TextInput fieldName="barmenDishBid" className="w-15 h-8" />
            <TextInput fieldName="dishDishBid" className="w-15 h-8" />
            <TextInput fieldName="percentTips" className="w-15 h-8" />
          </div>
        </div>
      </div>
    )
}