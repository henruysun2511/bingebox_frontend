import { Badge } from "@/components/ui/badge"; // Giả định bạn có component Badge từ shadcn/ui
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Room } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2 } from "lucide-react";

export const roomColumns = (
    onEdit: (room: Room) => void,
    onDelete: (id: string) => void
): ColumnDef<Room>[] => [
        {
            accessorKey: "name",
            header: "Tên phòng",
            cell: ({ row }) => <div className="font-medium text-white">{row.original.name}</div>,
        },
        {
            accessorKey: "cinema",
            header: "Rạp phim",
            cell: ({ row }) => {
                const cinema = row.original.cinema;
                return (
                    <div className="text-neutral-400">
                        {cinema && typeof cinema === "object" ? cinema.name : "Chưa xác định"}
                    </div>
                );
            },
        },
        {
            accessorKey: "format",
            header: "Định dạng",
            cell: ({ row }) => {
                const format = row.original.format;
                return (
                    <div className="text-neutral-400">
                        {format && typeof format === "object" ? format.name : "-"}
                    </div>
                );
            },
        },
        {
            accessorKey: "seatLayout",
            header: "Sơ đồ",
            cell: ({ row }) => {
                const layout = row.original.seatLayout;
                if (!layout) return <span className="text-neutral-500 italic text-xs">Chưa tạo</span>;
                return (
                    <span className="ml-1">
                        {layout.rows} x {layout.columns}
                    </span>
                );
            },
        },
        {
            id: "totalSeats",
            header: "Tổng ghế",
            cell: ({ row }) => {
                const totalSeats = row.original.totalSeats;

                return (
                    <div className="flex items-center gap-1.5 font-semibold">
                        {totalSeats ? totalSeats : "0"}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.original.status;
                const isActive = status === "active";

                return (
                    <Badge
                        className={cn(
                            "capitalize font-normal",
                            isActive
                                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                : "bg-neutral-500/10 text-neutral-500 border-neutral-500/20"
                        )}
                        variant="outline"
                    >
                        {isActive ? "Hoạt động" : status}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const room = row.original;
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="btn-edit"
                            onClick={() => onEdit(room)}
                        >
                            <EditIcon size={16} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="btn-delete"
                            onClick={() => onDelete(room._id)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                );
            },
        },
    ];