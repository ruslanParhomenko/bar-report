"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useCashForm } from "@/features/cash-month/hooks/use-cash-form";
import { CashMonthBodyTable } from "@/features/cash-month/ui/cash-month-body";
import { CashMonthFooterTable } from "@/features/cash-month/ui/cash-month-footer";
import CashInfo from "@/features/cash-month/ui/cash-month-info";
import CashMonthHeader from "@/features/cash-month/ui/shared/cash-month-header";
import { GetAoData } from "@/features/finance/a-o/model/type";
import { ROW_CASH_DATA } from "@/features/finance/cash/model/constants";
import type { GetCashData } from "@/features/finance/cash/model/type";
import { useEdit } from "@/providers/edit-provider";

export default function CashMonthEdit({
  dataAoByMonth,
  dataCashByMonth,
}: {
  dataAoByMonth: GetAoData | null;
  dataCashByMonth: GetCashData | null;
}) {
  const { isEdit } = useEdit();

  const { form, onSubmit } = useCashForm({ dataCashByMonth, dataAoByMonth });

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="mt-4 table-auto">
        <CashMonthHeader />

        <CashMonthBodyTable
          data={ROW_CASH_DATA}

          isEdit={isEdit}
        />
        <CashMonthFooterTable />
        <CashInfo isEdit={isEdit} />
      </Table>
    </FormWrapper>
  );
}
