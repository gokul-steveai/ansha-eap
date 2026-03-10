"use client"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

type ComboboxProps = {
    options: {label:string,value:string}[];
    value: string;
    onValueChange?: (newValue:string) => void;
    label?: string;
    

}
export default function Combobox({label = "Item",options, value, onValueChange}:ComboboxProps) {
  const [open, setOpen] = useState(false)
  const [val, setVal] = useState(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("border-input !ring-input bg-transparent h-full w-full justify-between", val ? "text-foreground" : "text-foreground/50")}
        >
          {val
            ? options.find((option) => option.value === val)?.label
            : `Select ${label}`}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>{`No ${label} found.`}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === val ? "" : currentValue
                    setVal(newValue)
                    if(onValueChange){
                        onValueChange(newValue)
                    }
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      val === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
