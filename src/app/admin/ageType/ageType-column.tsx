import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";

export const ageTypeColumns = (
  onEdit: (data: any) => void,
  onDelete: (id: string) => void
): ColumnDef<any>[] => [
  { accessorKey: "name", header: "Tên đối tượng" },
  { 
    header: "Khoảng tuổi",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{row.original.minAge}</Badge>
        <span>đến</span>
        <Badge variant="secondary">{row.original.maxAge}</Badge>
        <span>tuổi</span>
      </div>
    )
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