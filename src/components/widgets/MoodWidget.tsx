"use client";
import { useAppServiceContext } from "@/context/appServiceContext";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  ChartLineLabel,
  LineChartOptions,
  TypeChartData,
} from "../charts/lineChart";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const MoodWidget = ({
  chartClassName,
  chartOptions,
}: {
  chartOptions?: LineChartOptions;
  chartClassName?: string;
}) => {
  const today = new Date();
  const sixDaysAgo = new Date();
  sixDaysAgo.setDate(today.getDate() - 6);

  const [range, setRange] = useState<DateRange | undefined>({
    from: sixDaysAgo,
    to: today,
  });

  const { dailyCheckIns } = useAppServiceContext();

  const entryMap: Record<string, number> = {};
  dailyCheckIns.forEach((entry) => {
    const d = new Date(entry.created_at);
    const key = d.toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
    const moodScore = entry.responses.reduce(
      (sum, r) => sum + Number(r.answer),
      0
    );
    entryMap[key] = moodScore;
  });

  const chartData: TypeChartData = {
    x: { label: "days", data: [] },
    y: { label: "mood", data: [] },
  };

  // loop through 7 days in local time
  const loopDate = new Date(range?.from || today);
  while (loopDate <= (range?.to || sixDaysAgo)) {
    const key = loopDate.toLocaleDateString("en-CA"); // YYYY-MM-DD
    chartData.x.data.push(
      loopDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
    );

    chartData.y.data.push(entryMap[key] ?? 0);

    loopDate.setDate(loopDate.getDate() + 1);
  }

  return (
    <>
      <div className="flex flex-row flex-nowrap items-center justify-between gap-2 w-full md:mb-6">
        <p className="card-title">My Mood</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              className="justify-between font-normal btn-thin text-xs"
              size="sm"
              variant="ghost"
            >
              <CalendarIcon className="!w-[1em] !h-[1em] text-[inherit]" />
              {range?.from && range?.to
                ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                : "January 2025"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="end">
            <div className="flex flex-col space-y-2 p-3">
              {/* Preset buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  className="rounded-md border px-2 py-1 hover:bg-accent"
                  onClick={() =>
                    setRange({
                      from: today,
                      to: today,
                    })
                  }
                >
                  Today
                </button>
                <button
                  className="rounded-md border px-2 py-1 hover:bg-accent"
                  onClick={() => {
                    const from = new Date(today);
                    from.setDate(today.getDate() - 6);
                    setRange({ from, to: today });
                  }}
                >
                  Last 7 Days
                </button>
                <button
                  className="rounded-md border px-2 py-1 hover:bg-accent"
                  onClick={() => {
                    const start = new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1
                    );
                    const end = new Date(
                      today.getFullYear(),
                      today.getMonth() + 1,
                      0
                    );
                    setRange({ from: start, to: end });
                  }}
                >
                  This Month
                </button>
                <button
                  className="rounded-md border px-2 py-1 hover:bg-accent"
                  onClick={() => {
                    const prevMonth = new Date(
                      today.getFullYear(),
                      today.getMonth() - 1
                    );
                    const start = new Date(
                      prevMonth.getFullYear(),
                      prevMonth.getMonth(),
                      1
                    );
                    const end = new Date(
                      prevMonth.getFullYear(),
                      prevMonth.getMonth() + 1,
                      0
                    );
                    setRange({ from: start, to: end });
                  }}
                >
                  Last Month
                </button>
              </div>

              {/* Calendar */}
              <Calendar
                className="text-xs calendar"
                mode="range"
                defaultMonth={range?.from}
                selected={range}
                onSelect={setRange}
                fixedWeeks
                showOutsideDays
                captionLayout="dropdown"
                disabled={{ after: today }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <ChartLineLabel
        chartOptions={chartOptions}
        className={chartClassName}
        yDomain={[-1, 15]}
        chartData={chartData}
      />
    </>
  );
};

export default MoodWidget;
