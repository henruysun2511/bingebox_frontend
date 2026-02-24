import { Button } from "@/components/ui/button";
import { Membership } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";

export const membershipColumns = (
    onEdit: (data: Membership) => void,
    onDelete: (id: string) => void
): ColumnDef<Membership>[] => [
    { accessorKey: "name", header: "Tên hạng" },
    { 
        accessorKey: "minSpending", 
        header: "Chi tiêu tối thiểu",
        cell: ({ row }) => row.original.minSpending.toLocaleString() + "đ"
    },
    { 
        accessorKey: "pointAccumulationRate", 
        header: "Tích điểm",
        cell: ({ row }) => (row.original.pointAccumulationRate * 100).toFixed(0) + "%"
    },
    { 
        accessorKey: "discountRate", 
        header: "Giảm giá",
        cell: ({ row }) => (row.original.discountRate * 100).toFixed(0) + "%"
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button className="btn-edit" size="sm" onClick={() => onEdit(row.original)}>
                    <EditIcon size={16} />
                </Button>
                <Button className="btn-delete" size="sm" variant="destructive" onClick={() => onDelete(row.original._id)}>
                    <TrashIcon size={16} />
                </Button>
            </div>
        ),
    },
];