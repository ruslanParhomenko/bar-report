"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionsButton } from "../../components/buttons/ActionsButton";
import {
  MENU_ITEMS_CUCINA,
  PRODUCTS,
  PRODUCTS_CUCINA,
} from "../report/bar/constants";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  defaultStopList,
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "./schema";
import SelectFieldWithSearch from "@/components/inputs/SelectWithSearch";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { saveStopList } from "@/app/actions/stop-list/stopListAction";
import { toast } from "sonner";
import { useAbility } from "@/providers/AbilityProvider";
import { formatNowData } from "@/utils/formatNow";

type StopLitTableProps = {
  data: StopListSchemaType[];
  nameTag: "bar" | "cucina";
};

export default function StopListForm({ data, nameTag }: StopLitTableProps) {
  const { isBar, isCucina, isAdmin } = useAbility();

  const isAccount =
    (isBar && nameTag === "bar") ||
    (isCucina && nameTag === "cucina") ||
    isAdmin;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  const DATA_PRODUCTS = {
    bar: PRODUCTS,
    cucina: [...new Set([...PRODUCTS_CUCINA, ...MENU_ITEMS_CUCINA])],
  };

  // set form
  const form = useForm<StopListSchemaType>({
    resolver: yupResolver(stopListSchema),
    defaultValues: defaultStopListSchema,
  });
  const stopListValues = useFieldArray({
    control: form.control,
    name: "stopList",
  });
  const watchStopList =
    useWatch({ control: form.control, name: "stopList" }) ?? [];

  // save data with debounce
  const debouncedSave = (saveData: StopListSchemaType) => {
    const currentDataString = JSON.stringify(saveData);
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveStopList({ dataStopList: saveData, mail: nameTag });
        lastSavedDataRef.current = currentDataString;
        toast.success("Stop list saved successfully!");
      } catch (error) {
        console.error("Error saving stop list:", error);
        toast.error("Error saving stop list");
      }
    }, 2000);
  };

  // set form data on mount
  useEffect(() => {
    if (!data || isInitialized) return;

    form.reset(data[0]);
    lastSavedDataRef.current = JSON.stringify(data[0]);
    setIsInitialized(true);
  }, [data, form, isInitialized]);

  // clear timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isInitialized) return;

    watchStopList?.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        stopListValues.update(idx, {
          ...stopListValues.fields[idx],
          ...item,
          date,
        });
      }
    });

    if (isAccount) {
      const saveData = {
        stopList: watchStopList || [],
      };
      debouncedSave(saveData);
    }
  }, [watchStopList, data, isInitialized, isAccount]);

  return (
    <FormWrapper form={form} className="md:py-4">
      <Table className="[&_th]:text-center [&_td]:text-center table-fixed md:w-200 ">
        <TableHeader>
          <TableRow>
            <TableHead className="md:w-90 w-32" />
            <TableHead className="md:w-50 w-16">date</TableHead>
            <TableHead className="text-left md:w-30 w-12">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stopListValues.fields.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                <SelectFieldWithSearch
                  data={DATA_PRODUCTS[nameTag]}
                  fieldName={`stopList.${idx}.product`}
                  disabled={!isAccount}
                  className="h-9"
                />
              </TableCell>
              <TableCell className="text-center">
                {item.product && (
                  <div className="text-center text-rd">{item.date}</div>
                )}
              </TableCell>
              <TableCell className="flex justify-center">
                <ActionsButton
                  formFields={stopListValues}
                  idx={idx}
                  item={item.product}
                  disabled={!isAccount}
                  defaultValues={defaultStopList}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FormWrapper>
  );
}
