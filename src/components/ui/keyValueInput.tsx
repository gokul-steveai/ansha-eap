"use client";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Combobox from "./comboBox";

export type KeyValueOption = {
  label: string;
  value: string;
};

type KeyValueInputProps = {
  options: KeyValueOption[];
  label?: string;
  value?: { key: string; value: string };
  onChange?: (newVal: { key: string; value: string }) => void;
};

export default function KeyValueInput({
  options,
  value,
  onChange,
  label = "Item",
}: KeyValueInputProps) {
  const [itemName, setItemName] = useState(value?.key || "");
  const [itemValue, setItemValue] = useState(value?.value || "");

  useEffect(() => {
    if (onChange) {
      onChange({ key: itemName, value: itemValue });
    }
  }, [itemName, itemValue]);

  return (
    <div className="grid grid-cols-2 gap-2 items-center w-full">
      <div className="h-full">
        <Combobox
          value={itemName}
          onValueChange={(val) => setItemName(val)}
          label={label}
          options={options}
        />
      </div>
      <Input
        placeholder="Enter value"
        value={itemValue}
        onChange={(e) => setItemValue(e.target.value)}
        className="flex-1"
        required
      />
    </div>
  );
}
