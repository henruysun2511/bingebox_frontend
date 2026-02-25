import { Skeleton } from "@/components/ui/skeleton";

export default function BlogCardSkeleton() {
  return (
    <div className="w-[280px] bg-neutral-900/40 rounded-xl overflow-hidden border border-neutral-800">
      {/* Thumbnail Skeleton */}
      <Skeleton className="h-[180px] w-full rounded-t-xl" />

      {/* Content Container */}
      <div className="p-4 space-y-4">
        {/* Date Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Title Skeleton (2 lines) */}
        <div className="space-y-2">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-4/5" />
        </div>

        {/* Read More Link Skeleton */}
        <Skeleton className="h-3 w-16 mt-2" />
      </div>
    </div>
  );
}