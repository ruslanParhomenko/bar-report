"use client";

import FormWrapper from "@/components/wrapper/form-wrapper";
import useFormOrders from "@/features/staff/orders/use-form-orders";
import { useLocalStorageForm } from "@/hooks/use-local-storage";
import OrderCardWrapper from "./order-card-wrapper";

export const OrderForm = ({
  data,
  tab,
}: {
  data: Record<string, string[]>;
  tab: string;
}) => {
  const allKeys = Object.keys(data || {});
  const STORAGE_KEY = `order-new-${tab}`;

  const { form, onSubmit } = useFormOrders(tab);

  const { isLoaded } = useLocalStorageForm(form, STORAGE_KEY);

  if (!isLoaded) return null;

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <div className="columns-1 md:columns-3 lg:columns-5 xl:columns-6">
        {allKeys.map((key) => (
          <div key={key} className="break-inside-avoid">
            <OrderCardWrapper data={data[key]} name={key} />
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};
