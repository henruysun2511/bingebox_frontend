"use client";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGeneralStat } from "@/queries/useDashboardQuery";
import { DollarSign, Film, Ticket } from "lucide-react";

export function GeneralStat() {
  const { data, isPending } = useGeneralStat();
  const stats = data?.data;

  if (isPending) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Skeleton className="h-32 rounded-2xl bg-neutral-800" />
        <Skeleton className="h-32 rounded-2xl bg-neutral-800" />
        <Skeleton className="h-32 rounded-2xl bg-neutral-800" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Revenue */}
      <Card className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400 mb-1">
              Tổng Doanh Thu
            </p>
            <p className="text-3xl font-bold text-[#004aad]">
              {stats?.totalRevenue?.toLocaleString("vi-VN")} ₫
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#004aad]/10 group-hover:bg-[#004aad]/20 transition">
            <DollarSign className="w-6 h-6 text-[#004aad]" />
          </div>
        </CardContent>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-[#004aad]/5 opacity-0 group-hover:opacity-100 transition" />
      </Card>

      {/* Tickets */}
      <Card className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400 mb-1">
              Tổng Vé Đã Bán
            </p>
            <p className="text-3xl font-bold">
              {stats?.totalTickets?.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-700/30 group-hover:bg-neutral-700/50 transition">
            <Ticket className="w-6 h-6 text-neutral-300" />
          </div>
        </CardContent>
      </Card>

      {/* Movies */}
      <Card className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-950 to-neutral-900 shadow-lg hover:shadow-2xl transition-all duration-300">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-neutral-400 mb-1">
              Tổng Số Phim
            </p>
            <p className="text-3xl font-bold">
              {stats?.totalMovies?.toLocaleString("vi-VN")}
            </p>
          </div>

          <div className="p-3 rounded-xl bg-neutral-700/30 group-hover:bg-neutral-700/50 transition">
            <Film className="w-6 h-6 text-neutral-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}