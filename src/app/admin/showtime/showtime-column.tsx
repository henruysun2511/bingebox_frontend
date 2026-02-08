import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Building2, Calendar as CalendarIcon, Clock, EditIcon, Monitor, Trash2 } from "lucide-react";

export const showtimeColumns = (
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
                        <div className="relative h-12 w-8 overflow-hidden rounded border border-neutral-800">
                            <ImagePreview
                                src={movie?.poster || "/placeholder-poster.png"}
                                alt={movie?.name}
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <div className="font-medium text-white line-clamp-1">{movie?.name}</div>
                            <div className="text-[10px] text-neutral-500">{movie?.duration} phút</div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "cinema",
            header: "Rạp",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-neutral-400 text-sm">
                    <Building2 size={14} className="text-cyan-400" />
                    <span className="line-clamp-1">
                        {row.original.room?.cinema?.name || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "room",
            header: "Phòng chiếu",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-neutral-300">
                    <Monitor size={14} className="text-blue-400" />
                    <span>{row.original.room?.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "timeslot",
            header: "Khung giờ",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-purple-400" />
                    <span className="text-sm font-medium text-purple-200">
                        {row.original.timeslot?.name || "N/A"}
                    </span>
                </div>
            ),
        },
        {
            header: "Thời gian chi tiết",
            cell: ({ row }) => {
                const start = new Date(row.original.startTime);
                const end = new Date(row.original.endTime);
                return (
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                            <span>{format(start, "HH:mm")}</span>
                            <span className="text-neutral-600">-</span>
                            <span>{format(end, "HH:mm")}</span>
                        </div>
                        <div className="flex items-center gap-1 text-neutral-500 text-[11px]">
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
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10"
                        onClick={() => onEdit(row.original)}
                        title="Sửa"
                    >
                        <EditIcon size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-400 hover:bg-red-500/10"
                        onClick={() => onDelete(row.original._id)}
                        title="Xóa"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ];