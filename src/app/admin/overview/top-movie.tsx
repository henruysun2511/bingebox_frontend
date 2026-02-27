"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTopMovies } from "@/queries/useDashboardQuery";
import { useMemo, useState } from "react";

export function TopMovie() {
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const { data, isPending } = useTopMovies(dateRange);

  const movies = useMemo(() => {
    if (!data?.data?.length) return [];

    // Lấy group đầu tiên (API đang trả về theo tháng)
    const allMovies = data.data[0].movies;

    return [...allMovies].sort((a, b) => b.revenue - a.revenue);
  }, [data]);

  const handleFilterChange = (key: string, value: string) => {
    setDateRange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card className="bg-neutral-950 border border-neutral-800 text-white shadow-xl">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <CardTitle className="text-xl font-semibold tracking-tight">
              Top Phim Doanh Thu
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Xếp hạng phim có doanh thu cao nhất
            </CardDescription>
          </div>

          <div className="flex gap-3 items-end">
            <div>
              <Label className="text-xs text-neutral-400">Từ</Label>
              <Input
                type="date"
                className="h-9 bg-neutral-900 border-neutral-700 focus:border-[#004aad]"
                value={dateRange.from}
                onChange={(e) => handleFilterChange("from", e.target.value)}
              />
            </div>
            <div>
              <Label className="text-xs text-neutral-400">Đến</Label>
              <Input
                type="date"
                className="h-9 bg-neutral-900 border-neutral-700 focus:border-[#004aad]"
                value={dateRange.to}
                onChange={(e) => handleFilterChange("to", e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isPending ? (
          <Skeleton className="h-[300px] w-full bg-neutral-800 rounded-xl" />
        ) : movies.length > 0 ? (
          <div className="space-y-4">
            {movies.map((movie, index) => {
              const rank = index + 1;

              return (
                <div
                  key={movie.movieId}
                  className="flex items-center gap-4 bg-neutral-900 p-3 rounded-xl hover:bg-neutral-800 transition"
                >
                  {/* Rank */}
                  <div
                    className={`text-lg font-bold w-8 text-center ${rank === 1
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

                  {/* Poster */}
                  <div className="relative w-14 h-20 rounded-md overflow-hidden">
                    <img
                      src={movie.poster}
                      alt={movie.name}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium">{movie.name}</p>
                    <p className="text-sm text-neutral-400">
                      {movie.revenue.toLocaleString("vi-VN")} ₫
                    </p>
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