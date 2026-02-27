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
// Bổ sung import Input và Label từ shadcn
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useShowtimeSales } from "@/queries/useDashboardQuery";
import { ShowtimeSale } from "@/types/object";
// Bổ sung useState
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  ticketCount: {
    label: "Số vé",
    color: "#004aad",
  },
} satisfies ChartConfig;

export function ShowtimeSales() {
  // 1. Thêm state quản lý filter
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  // 2. Truyền dateRange vào hook
  const { data, isPending } = useShowtimeSales(dateRange);

  const rawData = data?.data as ShowtimeSale[] | undefined;

  const chartData: ShowtimeSale[] =
    rawData?.slice().sort((a, b) =>
      a.timeSlot.localeCompare(b.timeSlot)
    ) ?? [];

  // 3. Hàm xử lý thay đổi filter
  const handleFilterChange = (key: string, value: string) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-neutral-950 border border-neutral-800 text-white shadow-xl">
      <CardHeader>
        {/* 4. Sửa layout Header để chứa bộ lọc */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Vé Theo Khung Giờ
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Thống kê số lượng vé bán theo giờ chiếu
            </CardDescription>
          </div>

          {/* 5. Giao diện bộ lọc */}
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
            <BarChart data={chartData} margin={{ top: 20 }}>
              <CartesianGrid
                vertical={false}
                stroke="#1f2937"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="timeSlot"
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                stroke="#9ca3af"
              />

              <ChartTooltip
                cursor={{ fill: "rgba(0,74,173,0.08)" }}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      typeof value === "number"
                        ? `${value.toLocaleString("vi-VN")} vé`
                        : value
                    }
                  />
                }
              />

              <Bar
                dataKey="ticketCount"
                fill="#004aad"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="h-[320px] flex items-center justify-center text-neutral-500 text-sm">
            {/* 6. Cập nhật thông báo khi không có dữ liệu */}
            Không có dữ liệu trong khoảng thời gian này
          </div>
        )}
      </CardContent>
    </Card>
  );
}