import { DataTTN } from "@/features/settings/setting/model/type";
import { MONTHS } from "@/utils/get-month-days";
import { GetTTNData } from "../../moda-month/model/type";

export function getAllAgentData(
  data: GetTTNData[] | null,
  agentTTN: DataTTN["agent"],
) {
  return agentTTN.map((agent) => {
    const agentMonthData = MONTHS.map((month) => {
      const monthData = data?.find((d) => d.id === month);
      const supplierData = monthData?.ttnData?.rowSuppliers?.[agent];

      if (!supplierData) {
        return {
          month,
          minus: 0,
          plus: 0,
          final: 0,
        };
      }

      const minus = (supplierData.minus ?? []).reduce(
        (acc, value) => acc + (Number(value) || 0),
        0,
      );

      const plus = (supplierData.plus ?? []).reduce(
        (acc, value) => acc + (Number(value) || 0),
        0,
      );

      return {
        month,
        minus,
        plus,
        final: plus + minus,
      };
    });

    const totalMinus = agentMonthData.reduce(
      (acc, data) => acc + data.minus,
      0,
    );

    const totalPlus = agentMonthData.reduce((acc, data) => acc + data.plus, 0);

    const finalBalance = totalPlus + totalMinus;

    return {
      agent,
      agentMonthData,
      totalMinus,
      totalPlus,
      finalBalance,
    };
  });
}
