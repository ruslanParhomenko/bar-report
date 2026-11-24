"use client";

import { Table } from "@/components/ui/table";
import FormWrapper from "@/components/wrapper/form-wrapper";
import { useCashForm } from "@/features/cash-month/hooks/use-cash-form";
import type { GetCashData } from "@/features/cash-month/model/type";
import { CashMonthBodyEdit } from "@/features/cash-month/ui/edit-mode/cash-body-edit";
import CashFooterEdit from "@/features/cash-month/ui/edit-mode/cash-footer-edit";
import CashMonthHeader from "@/features/cash-month/ui/shared/cash-month-header";
import { GetAoData } from "@/features/finance/a-o/model/type";

export default function CashMonthEdit({
  dataAoByMonth,
  dataCashByMonth,
}: {
  dataAoByMonth: GetAoData | null;
  dataCashByMonth: GetCashData | null;
}) {
  const { form, onSubmit } = useCashForm({ dataCashByMonth, dataAoByMonth });

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <Table className="mt-4 table-auto">
        <CashMonthHeader />

        <CashMonthBodyEdit />
        <CashFooterEdit />
      </Table>
    </FormWrapper>
  );
}
