"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function MovieCardSkeleton() {
  return (
    <div className="w-[230px]">
      {/* Poster */}
      <Skeleton className="h-[320px] w-full rounded-xl" />

      {/* Badges */}
      <div className="flex gap-2 mt-3 flex-wrap">
        <Skeleton className="h-5 w-10 rounded" />
        <Skeleton className="h-5 w-16 rounded" />
        <Skeleton className="h-5 w-14 rounded" />
      </div>

      {/* Name */}
      <div className="mt-3 space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
      </div>

      {/* Categories */}
      <Skeleton className="h-4 w-2/3 mt-2" />
    </div>
  );
}