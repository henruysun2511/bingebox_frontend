"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRevenue } from "@/queries/useDashboardQuery";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  totalRevenue: {
    label: "Doanh thu",
    color: "#004aad",
  },
} satisfies ChartConfig;

export function Revenue() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const { data, isPending } = useRevenue(dateRange);
  const chartData = data?.data || [];

  const handleFilterChange = (key: string, value: string) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-neutral-950 border border-neutral-800 text-white shadow-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Doanh Thu
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Thống kê doanh thu theo thời gian
            </CardDescription>
          </div>

          <div className="flex gap-3 items-end">
            <div>
              <Label className="text-xs text-neutral-400">Từ</Label>
              <Input
                type="date"
                className="h-9 bg-neutral-900 border-neutral-700 focus:border-[#004aad] focus:ring-[#004aad]"
                value={dateRange.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-neutral-400">Đến</Label>
              <Input
                type="date"
                className="h-9 bg-neutral-900 border-neutral-700 focus:border-[#004aad] focus:ring-[#004aad]"
                value={dateRange.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <Skeleton className="h-[320px] w-full bg-neutral-800 rounded-xl" />
        ) : chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <BarChart data={chartData} margin={{ top: 20, right: 10 }}>
              <CartesianGrid
                vertical={false}
                stroke="#1f2937"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) => value.slice(0, 7)}
                stroke="#9ca3af"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  `${(value / 1_000_000).toFixed(1)}tr`
                }
                stroke="#9ca3af"
              />

              <ChartTooltip
                cursor={{ fill: "rgba(0,74,173,0.08)" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) => {
                      if (typeof value === "number") {
                        return value.toLocaleString("vi-VN") + " ₫";
                      }
                      return value;
                    }}
                  />
                }
              />

              <Bar
                dataKey="totalRevenue"
                fill="#004aad"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[320px] flex items-center justify-center text-neutral-500 text-sm">
            Không có dữ liệu trong khoảng thời gian này
          </div>
        )}
      </CardContent>
    </Card>
  );
}