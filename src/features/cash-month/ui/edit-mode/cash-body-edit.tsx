import CashRowEdit from "@/features/cash-month/ui/edit-mode/cash-row-edit";
import { useFormContext, useWatch } from "react-hook-form";

export function CashMonthBodyEdit() {
  const { control, register } = useFormContext();

  const value = useWatch({
    control: control,
    name: "rowCashData",
  });

  return (
    <>
      <CashRowEdit
        rowsSection={"1c"}
        rowCashData={value}
        diffRowSection={"cash"}
        withTotalByDay={false}
        withTotal={false}
        register={register}
      />
      <CashRowEdit
        rowsSection={"cash"}
        rowCashData={value}
        register={register}
      />
      <CashRowEdit
        rowsSection={"visa"}
        rowCashData={value}
        register={register}
      />
      <CashRowEdit
        rowsSection={"visa-terminal"}
        rowCashData={value}
        register={register}

        diffRowSection={"visa"}
        withTotalByDay={false}
        withTotal={false}
      />
      <CashRowEdit
        rowsSection={"coll"}
        rowCashData={value}
        withTotalByDay={false}
        register={register}
      />
      <CashRowEdit
        rowsSection={"nbm"}
        rowCashData={value}
        register={register}
        withTotal={false}
        withTotalByDay={false}
      />
    </>
  );
}
