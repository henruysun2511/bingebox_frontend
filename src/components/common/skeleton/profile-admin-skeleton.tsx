import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-64 bg-neutral-800" />
      <Skeleton className="h-64 w-full bg-neutral-900 rounded-lg" />
    </div>
  );
}