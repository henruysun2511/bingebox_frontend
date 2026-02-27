"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMembershipDistribution } from "@/queries/useDashboardQuery";
import type { MembershipDistribution } from "@/types/object";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const COLORS = [
  "#004aad",
  "#2563eb",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
];

export function MembershipDistribution() {
  const { data, isPending } = useMembershipDistribution();

  const chartData: MembershipDistribution[] = data?.data ?? [];
  const total = chartData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="bg-neutral-950 border border-neutral-800 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Phân Bổ Hạng Thành Viên
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Tỷ lệ các hạng thành viên trong hệ thống
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <Skeleton className="h-[320px] w-full bg-neutral-800 rounded-xl" />
        ) : chartData.length > 0 ? (
          <div className="h-[320px] w-full flex items-center justify-center">
            <PieChart width={350} height={300}>
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ percent }) =>
                  `${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                content={({ payload }) => {
                  if (!payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="bg-neutral-900 border border-neutral-700 px-3 py-2 rounded-lg text-sm">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-neutral-400">
                        {item.count.toLocaleString("vi-VN")} thành viên
                      </p>
                    </div>
                  );
                }}
              />

              <Legend
                wrapperStyle={{
                  color: "#9ca3af",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </div>
        ) : (
          <div className="h-[320px] flex items-center justify-center text-neutral-500 text-sm">
            Không có dữ liệu
          </div>
        )}
      </CardContent>
    </Card>
  );
}