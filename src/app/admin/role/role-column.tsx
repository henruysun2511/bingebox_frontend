import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Role } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";

export const roleColumns = (
    onEdit: (role: Role) => void,
    onDelete: (id: string) => void
): ColumnDef<Role>[] => [
        { accessorKey: "name", header: "Tên Role" },
        { accessorKey: "description", header: "Mô tả" },
        {
            accessorKey: "permissions",
            header: "Số lượng quyền",
            cell: ({ row }) => <Badge variant="outline">{row.original.permissions?.length || 0} quyền</Badge>
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(row.original)}>
                        <EditIcon size={16} className="text-blue-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(row.original._id)}>
                        <TrashIcon size={16} className="text-red-500" />
                    </Button>
                </div>
            ),
        },
    ];