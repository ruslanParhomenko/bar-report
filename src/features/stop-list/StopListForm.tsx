"use client";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionsButton } from "../../components/buttons/ActionsButton";
import { useTranslations } from "next-intl";
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
  data: StopListSchemaType;
  nameTag: "bar" | "cucina";
};

export default function StopListForm({ data, nameTag }: StopLitTableProps) {
  const t = useTranslations("Home");

  const { isBar, isCucina, isAdmin } = useAbility();
  const isDisabled = !isBar && !isCucina && !isAdmin;

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  const LABEL = {
    bar: "stopList",
    cucina: "stopListCucina",
  } as const;
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
    name: LABEL[nameTag],
  });
  const watchStopList =
    useWatch({ control: form.control, name: LABEL[nameTag] }) ?? [];

  // save data with debounce
  const debouncedSave = (saveData: Omit<StopListSchemaType, "id">) => {
    const currentDataString = JSON.stringify(saveData);
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveStopList({ dataStopList: saveData, mail: "bar-cucina" });
        lastSavedDataRef.current = currentDataString;
        toast.success("Stop list saved successfully!");
      } catch (error) {
        toast.error("Error saving stop list");
      }
    }, 3000);
  };

  // set form data on mount
  useEffect(() => {
    if (!data || isInitialized) return;

    const resetData = {
      stopList: data.stopList || [{ ...defaultStopList }],
      stopListCucina: data.stopListCucina || [{ ...defaultStopList }],
    };

    form.reset(resetData);
    lastSavedDataRef.current = JSON.stringify(resetData);
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

  // save on change
  useEffect(() => {
    if (!isBar || !Array.isArray(watchStopList) || !isInitialized) return;

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

    if (isBar && data) {
      const saveData = {
        stopList: watchStopList,
        stopListCucina: data.stopListCucina || [],
      };
      debouncedSave(saveData);
    }
  }, [watchStopList, isBar, data, isInitialized]);

  useEffect(() => {
    if (!isCucina || !Array.isArray(watchStopList) || !isInitialized) return;

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

    if (isCucina && data) {
      const saveData = {
        stopList: data.stopList || [],
        stopListCucina: watchStopList,
      };
      debouncedSave(saveData);
    }
  }, [watchStopList, isCucina, data, isInitialized]);
  return (
    <FormWrapper form={form} className="xl:px-5">
      <Label className="text-lg font-semibold pb-7 text-bl">{t(nameTag)}</Label>
      <Table className="[&_th]:text-center [&_td]:text-center table-fixed md:w-160 ">
        <TableHeader>
          <TableRow className="h-10">
            <TableHead className="md:w-90 w-32">Product</TableHead>
            <TableHead className="md:w-50 w-16">Date</TableHead>
            <TableHead className="text-left md:w-30 w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stopListValues.fields.map((item, idx) => (
            <TableRow key={item.id}>
              <TableCell>
                <SelectFieldWithSearch
                  data={DATA_PRODUCTS[nameTag]}
                  fieldName={`${LABEL[nameTag]}.${idx}.product`}
                  disabled={isDisabled}
                  className="h-10"
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
                  disabled={isDisabled}
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
