"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopCustomers } from "@/queries/useDashboardQuery";
import { useMemo } from "react";

export function TopCustomer() {
  const { data, isPending } = useTopCustomers();

  const customers = useMemo(() => {
    if (!data?.data) return [];

    return [...data.data].sort(
      (a, b) => b.totalSpending - a.totalSpending
    );
  }, [data]);

  return (
    <Card className="bg-neutral-950 border border-neutral-800 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Khách Hàng Thân Thiết
        </CardTitle>
        <CardDescription className="text-neutral-400">
          Xếp hạng khách hàng có tổng chi tiêu cao nhất
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <Skeleton className="h-[300px] w-full bg-neutral-800 rounded-xl" />
        ) : customers.length > 0 ? (
          <div className="space-y-4">
            {customers.map((customer, index) => {
              const rank = index + 1;

              return (
                <div
                  key={customer._id}
                  className="flex items-center gap-4 bg-neutral-900 p-3 rounded-xl hover:bg-neutral-800 transition"
                >
                  {/* Rank */}
                  <div
                    className={`text-lg font-bold w-8 text-center ${
                      rank === 1
                        ? "text-yellow-400"
                        : rank === 2
                        ? "text-gray-300"
                        : rank === 3
                        ? "text-orange-400"
                        : "text-neutral-400"
                    }`}
                  >
                    {rank}
                  </div>

                  {/* Avatar */}
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800">
                    {customer.avatar ? (
                      <img
                        src={customer.avatar}
                        alt={customer.fullName || customer.email}
                        className="object-cover w-ful h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-sm text-neutral-400">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium">
                      {customer.fullName || customer.email}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {customer.membership?.name || "N/A"}
                    </p>
                  </div>

                  {/* Spending */}
                  <div className="text-sm font-semibold text-[#004aad]">
                    {customer.totalSpending.toLocaleString("vi-VN")} ₫
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-neutral-500 text-sm">
            Không có dữ liệu
          </div>
        )}
      </CardContent>
    </Card>
  );
}