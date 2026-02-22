import { Button } from "@/components/ui/button";
import { TicketPrice } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "lucide-react";

export const ticketPriceColumns = (
    onEdit: (data: TicketPrice) => void,
    onDelete: (id: string) => void
): ColumnDef<TicketPrice>[] => [
    {
        accessorKey: "dayOfWeek",
        header: "Thứ",
        cell: ({ row }) => <span className="capitalize">{row.original.dayOfWeek}</span>
    },
    {
        accessorKey: "timeSlot",
        header: "Khung giờ",
        cell: ({ row }) => <span className="capitalize">{row.original.timeSlot?.name || "N/A"}</span>
    },
    {
        accessorKey: "formatRoom",
        header: "Định dạng",
        cell: ({ row }) => <span>{row.original.formatRoom?.name || "N/A"}</span>
    },
    {
        accessorKey: "seatType",
        header: "Loại ghế",
        cell: ({ row }) => <span>{row.original.seatType?.name || "N/A"}</span>
    },
    {
        accessorKey: "finalPrice",
        header: "Giá tiền",
        cell: ({ row }) => (
            <span className="font-bold text-yellow-500">
                {row.original.finalPrice.toLocaleString()}đ
            </span>
        )
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button className="btn-edit" size="sm" variant="ghost" onClick={() => onEdit(row.original)}>
                    <EditIcon size={16} />
                </Button>
                <Button className="btn-delete" size="sm" variant="destructive" onClick={() => onDelete(row.original._id)}>
                    <DeleteIcon size={16} />
                </Button>
            </div>
        )
    }
];