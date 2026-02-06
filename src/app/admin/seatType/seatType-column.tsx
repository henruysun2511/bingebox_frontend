import { Button } from "@/components/ui/button";
import { SeatType } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "lucide-react";

export const seatTypeColumns = (
  onEdit: (type: SeatType) => void,
  onDelete: (id: string) => void
): ColumnDef<SeatType>[] => [
    {
      accessorKey: "name",
      header: "Tên loại ghế",
      cell: ({ row }) => <span className="font-bold text-white">{row.original.name}</span>,
    },
    {
      accessorKey: "color",
      header: "Màu sắc",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div 
            className="w-6 h-6 rounded border border-white/20" 
            style={{ backgroundColor: row.original.color }} 
          />
          <code className="text-xs">{row.original.color}</code>
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button className="btn-edit" size="sm" onClick={() => onEdit(row.original)}>
            <EditIcon size={16} /> Sửa
          </Button>
          <Button className="btn-delete" size="sm" variant="destructive" onClick={() => onDelete(row.original._id)}>
            <DeleteIcon size={16} /> Xóa
          </Button>
        </div>
      ),
    },
  ];