"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
      item.toLowerCase().includes(search.toLowerCase())
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
                        "w-full border rounded-md px-2 py-1 text-left flex justify-between items-center [&>svg]:hidden",
                        field.value
                          ? "text-base overflow-hidden text-ellipsis whitespace-nowrap"
                          : "text-gray-300 text-base",
                        className,
                        theme === "dark" ? "border-0 bg-background" : ""
                      )}
                      disabled={disabled}
                    >
                      {field.value || placeHolder}
                      <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
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
                                    : "opacity-0"
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
