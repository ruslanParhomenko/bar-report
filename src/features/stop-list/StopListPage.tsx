"use client";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useEffect, useCallback, useRef, useState } from "react";
import { formatNowData } from "@/utils/formatNow";
import {
  defaultStopList,
  defaultStopListSchema,
  stopListSchema,
  StopListSchemaType,
} from "./schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { StopListTable } from "./StopListTable";
import { useAbility } from "@/providers/AbilityProvider";
import { FormWrapper } from "@/components/wrapper/FormWrapper";
import { saveStopList } from "@/app/actions/stop-list/stopListAction";
import { toast } from "sonner";

type StopListProps = {
  form_data: StopListSchemaType;
  user_email: string;
};

export default function StopListPage({ data }: { data: StopListProps[] }) {
  const { isBar, isCucina, isAdmin } = useAbility();
  const isDisabled = !isBar && !isCucina && !isAdmin;
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedDataRef = useRef<string>("");
  const [isInitialized, setIsInitialized] = useState(false);

  const form = useForm<StopListSchemaType>({
    resolver: yupResolver(stopListSchema),
    defaultValues: defaultStopListSchema,
  });

  const stopListValues = useFieldArray({
    control: form.control,
    name: "stopList",
  });
  const stopListCucinaValues = useFieldArray({
    control: form.control,
    name: "stopListCucina",
  });

  const watchStopList =
    useWatch({ control: form.control, name: "stopList" }) ?? [];
  const watchStopListCucina =
    useWatch({ control: form.control, name: "stopListCucina" }) ?? [];

  const debouncedSave = useCallback(
    (saveData: Omit<StopListSchemaType, "id">) => {
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
    },
    []
  );

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

    if (isBar && data?.[0]?.form_data) {
      const saveData = {
        stopList: watchStopList,
        stopListCucina: data[0].form_data.stopListCucina || [],
      };
      debouncedSave(saveData);
    }
  }, [watchStopList, isBar, data, debouncedSave, isInitialized]);

  useEffect(() => {
    if (!isCucina || !Array.isArray(watchStopListCucina) || !isInitialized)
      return;

    watchStopListCucina?.forEach((item, idx) => {
      if (item?.product && !item.date) {
        const date = formatNowData();
        stopListCucinaValues.update(idx, {
          ...stopListCucinaValues.fields[idx],
          ...item,
          date,
        });
      }
    });

    if (isCucina && data?.[0]?.form_data) {
      const saveData = {
        stopList: data[0].form_data.stopList || [],
        stopListCucina: watchStopListCucina,
      };
      debouncedSave(saveData);
    }
  }, [watchStopListCucina, isCucina, data, debouncedSave, isInitialized]);

  useEffect(() => {
    if (!data?.[0]?.form_data || isInitialized) return;

    const resetData = {
      stopList: data[0].form_data.stopList || [{ ...defaultStopList }],
      stopListCucina: data[0].form_data.stopListCucina || [
        { ...defaultStopList },
      ],
    };

    form.reset(resetData);
    lastSavedDataRef.current = JSON.stringify(resetData);
    setIsInitialized(true);
  }, [data, form, isInitialized]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <FormWrapper form={form}>
      <div className="grid xl:grid-cols-2 gap-5 pb-5">
        <StopListTable
          formFields={stopListValues}
          nameTag="bar"
          disabled={isDisabled || !isBar}
        />
        <StopListTable
          formFields={stopListCucinaValues}
          nameTag="cucina"
          disabled={isDisabled || !isCucina}
        />
      </div>
    </FormWrapper>
  );
}
