"use client"
import { ChartRadialText } from "@/components/charts/activityChart";
import Calendar22 from "../calendar-22";
import { useState } from "react";

const ActivityWidget = () => {
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)
    console.log(dateFilter)
  return (
    <>
      <div className="flex flex-row flex-nowrap items-center justify-between gap-2 w-full mb-2">
        <h3 className="card-title">Activity</h3>
        <Calendar22 onSelect={(date)=>setDateFilter(date)}/>
      </div>
      <ChartRadialText />
    </>
  );
};

export default ActivityWidget;
