"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTheme } from "next-themes";

type Props = {
  fieldName: string;
  placeHolder?: string;
  data: string[];
  disabled?: boolean;
  className?: string;
};

function SelectFieldWithSearch({
  fieldName,
  placeHolder,
  data,
  disabled,
  className,
}: Props) {
  const { theme } = useTheme();
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (!search) return data;
    return data.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, data]);

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => (
        <FormField
          control={control}
          name={fieldName}
          render={() => (
            <FormItem>
              <FormControl>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-8 w-full items-center justify-between rounded-md border px-2",
                        field.value
                          ? "overflow-hidden border-0 text-ellipsis whitespace-nowrap"
                          : "",
                        className,
                        theme === "dark" ? "bg-background border-0" : "",
                      )}
                      disabled={disabled}
                    >
                      <span className="truncate">
                        {field.value || placeHolder}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search..."
                        className="h-9"
                        value={search}
                        onValueChange={(val) => setSearch(val)}
                        disabled={disabled}
                      />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {filteredOptions.map((item) => (
                            <CommandItem
                              key={item}
                              value={item}
                              onSelect={(val) => {
                                field.onChange(val);
                                setOpen(false);
                                setSearch(val);
                              }}
                            >
                              {item}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field.value === item
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    />
  );
}

export default SelectFieldWithSearch;
