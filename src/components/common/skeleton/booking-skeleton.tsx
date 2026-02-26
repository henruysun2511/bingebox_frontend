import { Skeleton } from "@/components/ui/skeleton";

export default function BookingDetailSkeleton() {
    return (
        <div className="container mx-auto py-10 px-4 flex flex-col lg:flex-row gap-8">
            <Skeleton className="flex-1 h-[600px] bg-neutral-900 rounded-xl" />
            <Skeleton className="w-full lg:w-[450px] h-[500px] bg-neutral-900 rounded-xl" />
        </div>
    );
}