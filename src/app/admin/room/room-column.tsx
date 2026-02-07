import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BaseStatusEnum } from "@/constants/enum";
import { Room } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, Trash2 } from "lucide-react";



export const roomColumns = (
    onEdit: (room: Room) => void,
    onDelete: (id: string) => void,
    onChangeStatus: (id: string, status: string) => void
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
                const room = row.original;
                const isActive = room.status === BaseStatusEnum.ACTIVE;

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => {
                                const newStatus = checked ? BaseStatusEnum.ACTIVE : BaseStatusEnum.INACTIVE;
                                onChangeStatus(room._id, newStatus);
                            }}
                            className="switch-custom"
                        />
                    </div>
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