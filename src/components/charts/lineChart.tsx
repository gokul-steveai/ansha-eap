"use client";

import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

export type TypeChartData = {
  x: {
    label: string;
    data: string[];
  };
  y: {
    label: string;
    data: number[];
  };
};

export type LineChartOptions = {
    line: {
      strokeWidth?: number;
      dot?: {
        radius?: number;
        strokeWidth?: number;
      },
      activeDot?: {
        radius?: number;
        strokeWidth?: number;
      };
    }
  }

type ChartLineLabelProps = {
  chartOptions?:LineChartOptions;
  className?:string;
  chartData: TypeChartData;
  yTickCount?: number;
  yDomain?:
    | [number, number]
    | ["dataMin", "dataMax"]
    | ["dataMin - 1", "dataMax + 1"];
};

const margin = {
  top: 20,
  left: 12,
  right: 12,
};

export function ChartLineLabel({
  chartOptions,
  chartData,
  yTickCount = 6,
  yDomain,
  className,
}: ChartLineLabelProps) {
  const xDataKey = chartData.x.label;
  const yDataKey = chartData.y.label;

  const formattedData = chartData.x.data.map((x, index) => ({
    [xDataKey]: x,
    [yDataKey]: chartData.y.data[index],
  }));

  const chartConfig = {
    x: {
      label: "test",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

const chartWidthClass = `${formattedData.length * 50}px`

  return (
<ChartContainer
  config={chartConfig}
  className={cn("h-[200px] w-full overflow-x-auto", className)}
>
  <div
  className="h-full min-w-full"
  style={{width: chartWidthClass}}
  >
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={formattedData} margin={margin} accessibilityLayer>
        <defs>
          <linearGradient id="valueBasedGradient" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--color-app-purple-300)" stopOpacity={1} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={1} />
          </linearGradient>
        </defs>

        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={xDataKey}
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval={0}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <YAxis
          domain={yDomain ?? ["dataMin - 1", "dataMax + 1"]}
          tickCount={yTickCount}
          tickLine={false}
          axisLine={false}
          hide
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />

        <Line
          connectNulls
          dataKey={yDataKey}
          type="monotone"
          stroke="url(#valueBasedGradient)"
          strokeWidth={chartOptions?.line?.strokeWidth || 5}
          dot={(props) => {
            const { key, dataKey, ...rest } = props;
            return (
              <circle
                key={key + dataKey}
                {...rest}
                r={chartOptions?.line?.dot?.radius || 8}
                strokeWidth={chartOptions?.line?.dot?.strokeWidth || 2}
                stroke="white"
                fill="var(--color-primary)"
              />
            );
          }}
          activeDot={{
            r: chartOptions?.line?.activeDot?.radius || 10,
            stroke: "white",
            fill: "var(--color-primary)",
          }}
        >
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Line>
      </LineChart>
    </ResponsiveContainer>
  </div>
</ChartContainer>



  );
}
