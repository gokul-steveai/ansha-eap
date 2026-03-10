"use client";

import { ReactElement, useState, cloneElement } from "react";
import { Button } from "./button";
import { X } from "lucide-react";

type DynamicFieldsProps<T> = {
  /** The React element to clone for each row */
  formControl: ReactElement<{ value?: T; onChange?: (val: T) => void }>;
  /** Optional initial array of values for each row */
  initialValues?: T[];
  /** Callback when the values of all rows change */
  onChange?: (values: T[]) => void;
  addBtn?: {
    className?: string; 
    text?: string;
  }
};

export default function FormDynamicFields<T>({
  formControl,
  initialValues = [],
  onChange,
  addBtn,
}: DynamicFieldsProps<T>) {
  const [rows, setRows] = useState<T[]>(initialValues);

  const addRow = () => {
    const updated = [...rows, undefined as unknown as T];
    setRows(updated);
    onChange?.(updated);
  };

  const removeRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
    onChange?.(updated);
  };

  const updateRow = (index: number, value: T) => {
    const updated = [...rows];
    updated[index] = value;
    setRows(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-2">
      {rows.map((rowValue, i) => (
        <div key={i} className="flex gap-2 items-center">
          {cloneElement(formControl, {
            value: rowValue,
            onChange: (val: T) => updateRow(i, val),
          })}
          <Button variant="ghost" size="icon" onClick={() => removeRow(i)}>
            <X size={16} />
          </Button>
        </div>
      ))}
      <Button variant="outline" className={addBtn?.className} onClick={addRow}>{addBtn?.text || 'Add'}</Button>
    </div>
  );
}
