import { Button } from "@/components/ui/button";
import { TimeSlot } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { Clock, EditIcon, Trash2 } from "lucide-react";

export const timeSlotColumns = (
    onEdit: (data: TimeSlot) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "name",
            header: "Tên khung giờ",
            cell: ({ row }) => <div className="font-bold text-white">{row.original.name}</div>,
        },
        {
            header: "Thời gian",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-white">
                    <Clock size={14} className="text-neutral-500" />
                    <span>{row.original.startTime}</span>
                    <span className="text-neutral-500">-</span>
                    <span>{row.original.endTime}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="btn-edit" onClick={() => onEdit(row.original)}>
                        <EditIcon size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="btn-delete" onClick={() => onDelete(row.original._id)}>
                        <Trash2 size={16} />
                    </Button>
                </div>
            ),
        },
    ];