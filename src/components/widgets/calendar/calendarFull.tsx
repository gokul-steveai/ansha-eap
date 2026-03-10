"use client"
import Container from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { useState } from "react";

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function getDaysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex, 1).getDay();
}

export function generateMonth(year: number, monthIndex: number) {
  const daysInMonth = getDaysInMonth(year, monthIndex);
  const firstDay = getFirstDayOfMonth(year, monthIndex);

  const weeks: (number | null)[][] = [];
  let week: (number | null)[] = [];

  // Fill in empty slots before first day
  for (let i = 0; i < firstDay; i++) {
    week.push(null);
  }

  // Fill in days
  for (let day = 1; day <= daysInMonth; day++) {
    week.push(day);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  // Fill in remaining slots after last day
  if (week.length > 0) {
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
}

const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
function generateMonthFlat(year: number, monthIndex: number) {
    const daysInMonth = getDaysInMonth(year, monthIndex);
    const firstDay = getFirstDayOfMonth(year, monthIndex);
  
    const result: { day: string; date: number | null }[] = [];
  
    // Fill in empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      result.push({ day: daysOfWeek[i], date: null });
    }
  
    // Fill in days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = daysOfWeek[(firstDay + day - 1) % 7];
      result.push({ day: dayOfWeek, date: day });
    }
  
    // Optional: fill remaining slots to complete the last week (so total length % 7 === 0)
    const remaining = 7 - (result.length % 7);
    if (remaining < 7) {
      for (let i = 0; i < remaining; i++) {
        result.push({ day: daysOfWeek[(firstDay + daysInMonth + i) % 7], date: null });
      }
    }
  
    return result;
  }

const CalendarFull = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const year = new Date().getFullYear();
  const weeks = generateMonthFlat(year, selectedMonth);

  function selectMonth(month: number) {
    setSelectedMonth(month);
  }

  return (
    <Container className="card relative">
      <div className="p-4">
        {/* Months Selector */}
        <ul className="sticky top-0 flex flex-row flex-nowrap gap-6 overflow-auto scrollbar-hidden mb-6">
          {months.map((i, index) => (
            <li
              key={i + "month"}
              className={cn(
                "font-medium text-muted-foreground capitalize hover:text-app-purple-300 cursor-pointer",
                selectedMonth === index && "text-app-purple-300"
              )}
              onClick={() => selectMonth(index)}
            >
              {i}
            </li>
          ))}
        </ul>

        <div className="grid grid-rows-25 overflow-auto scrollbar-hidden w-full">
          {Array.from({ length: 25 }).map((_, i) => {
            const isHeader = i == 0
            
            return (
              <div
                key={i}
                className="flex flex-row flex-nowrap min-h-[48px] min-w-[100px]"
              >
                {weeks &&
                  weeks.flatMap(i => i).map((i, index) => {
                    if(!i.date) return
                    const isActive = i.date == 1
                    return (
                      <div
                        key={index}
                        className={cn("min-h-[48px] min-w-[150px]", !isHeader && "border border-border mr-[-1px]")}
                      >

                        {isHeader && <div className="flex flex-col gap-2 items-center justify-center">
                        <span
                            className={cn("text-lg font-medium aspect-square w-auto flex items-center justify-center rounded-full p-2 bg-muted", isActive && "bg-app-purple-300 text-white")}
                        >{i.date}</span>
                        <span className="text-xs">{i.day.slice(0,3)}</span>
                        
                        </div>}
                        
                        
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
    </Container>
  );
};

export default CalendarFull;
