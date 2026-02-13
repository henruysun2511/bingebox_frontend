import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Button } from "@/components/ui/button";
import { SUBTITLE_TYPE_OPTIONS } from "@/constants/filter";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { CalendarIcon, EditIcon, Trash2 } from "lucide-react";

export const compactShowtimeColumns = (
    onEdit: (data: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "movie",
            header: "Phim",
            cell: ({ row }) => {
                const movie = row.original.movie;
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative h-10 w-7 overflow-hidden rounded border border-neutral-800">
                            <ImagePreview
                                src={movie?.poster || "/placeholder-poster.png"}
                                alt={movie?.name}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <div className="font-medium text-white text-xs line-clamp-1">{movie?.name}</div>
                            <div className="text-[10px] text-neutral-500">{movie?.duration} phút</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "subtitle",
            header: "Loại subtitle",
            cell: ({ row }) => {
                const value = row.original.subtitle;
                const option = SUBTITLE_TYPE_OPTIONS.find((opt) => opt.value === value);
                return (
                    <span className="text-xs font-medium text-neutral-300">
                        {option ? option.label : value}
                    </span>
                );
            },
        },
        {
            header: "Thời gian",
            cell: ({ row }) => {
                const start = new Date(row.original.startTime);
                const end = new Date(row.original.endTime);
                return (
                    <div className="flex items-center gap-2 text-orange-400 font-bold text-xs">
                        <span>{format(start, "HH:mm")}</span>
                        <span className="text-neutral-600">-</span>
                        <span>{format(end, "HH:mm")}</span>
                    </div>
                );
            },
        },
        {
            header: "Ngày",
            cell: ({ row }) => {
                const start = new Date(row.original.startTime);
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 font-bold text-neutral-500 text-xs">
                            <CalendarIcon size={10} />
                            {format(start, "dd/MM/yyyy")}
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Thao tác",
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-400" onClick={() => onEdit(row.original)}>
                        <EditIcon size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => onDelete(row.original._id)}>
                        <Trash2 size={14} />
                    </Button>
                </div>
            ),
        },
    ];