"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

type Calendar22Props = {
  value?: Date | undefined; // optional
  onSelect?: (date: Date | undefined) => void; // optional
  buttonClass?: string;
}

export default function Calendar22({ value, onSelect, buttonClass }: Calendar22Props) {
  const [open, setOpen] = React.useState(false)
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value)

  // keep internal state in sync if value is controlled
  React.useEffect(() => {
    if (value !== undefined) {
      setInternalDate(value)
    }
  }, [value])

  function handleSelect(date: Date | undefined) {
    if (value === undefined) {
      // uncontrolled mode → manage own state
      setInternalDate(date)
    }
    setOpen(false)
    onSelect?.(date) // notify parent if provided
  }

  const displayDate = value ?? internalDate

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          id="date"
          size="sm"
          className={cn("justify-between font-normal btn-thin text-xs", buttonClass)}
        >
          {displayDate ? displayDate.toLocaleDateString() : "Select date"}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          selected={displayDate}
          captionLayout="dropdown"
          onSelect={handleSelect}
        />
      </PopoverContent>
    </Popover>
  )
}
