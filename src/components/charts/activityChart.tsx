"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  ChartContainer,
} from "@/components/ui/chart";

export const description = "A radial chart with text";

// const chartData = [
//   { date: "Today", visitors: 100, fill: "var(--color-app-blue-400)" },
//   { browser: "Writing", visitors: 200, fill: "var(--color-app-red-200)" },
//   { browser: "Video/clip", visitors: 300, fill: "var(--color-app-red-400)" },
//   { browser: "Task", visitors: 30, fill: "var(--color-app-yellow-400)" },
// ]

const apiData = [
  {
    label: "reading",
    value: "30m",
    color: "var(--color-primary)",
  },
  {
    label: "writing",
    value: "20m",
    color: "var(--color-orange-400)",
  },
  {
    label: "video",
    value: "25m",
    color: "var(--color-app-purple-300)",
  },
  {
    label: "task",
    value: "35m",
    color: "var(--color-app-purple-400)",
  },
];

export function ChartRadialText() {
  const chartDataObj: Record<string, number> = {};
  const chartConfig: Record<string, { label: string; color: string }> = {};
  let total = 0;

  apiData.forEach((item) => {
    const minutes = parseInt(item.value);
    chartDataObj[item.label] = minutes;
    chartConfig[item.label] = {
      label: item.label,
      color: item.color,
    };
    total += isNaN(minutes) ? 0 : minutes;
  });

  const chartData = [chartDataObj];
  const totalFormatted = `${Math.floor(total / 60)}h ${total % 60}m`;
  const maxMinutes = 24 * 60
  return (
    <div>
    <ChartContainer
      config={chartConfig}
      className="radialChart mx-auto aspect-square max-h-[140px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={250}
        innerRadius={60}
        outerRadius={90}
        barSize={10}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[64, 54]}
          
        />
        {Object.entries(chartConfig).map(([key, { label, color }]) => (
          <RadialBar
            key={`${label}-${color}`}
            stackId="a"
            dataKey={key}
            name={label}
            fill={color}
            cornerRadius={10}
          />
        ))}

        <PolarRadiusAxis domain={[0, maxMinutes]} tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-base font-bold"
                    >
                      {totalFormatted.toLocaleString()}
                    </tspan>
                    {/* <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan> */}
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
       <div className="mt-4 grid grid-cols-2 gap-4 space-between text-sm">
       {apiData.map((item) => (
         <div key={item.label} className="flex items-center gap-2">
           <span
             className="inline-block w-3 h-3 rounded-[4px]"
             style={{ backgroundColor: item.color }}
           />
           <span className="text-muted-foreground capitalize">{item.label}</span>
         </div>
       ))}
     </div>
     </div>
  );
}
