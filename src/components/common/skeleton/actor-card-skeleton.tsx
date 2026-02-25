import { Skeleton } from "@/components/ui/skeleton";

export default function ActorCardSkeleton() {
  return (
        <div className="flex flex-wrap gap-x-8 gap-y-10 justify-center sm:justify-start">
            {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center space-y-3">
                    <Skeleton className="w-[110px] h-[110px] rounded-full bg-neutral-800" />
                    <Skeleton className="h-4 w-20 bg-neutral-800" />
                </div>
            ))}
        </div>
    );
}