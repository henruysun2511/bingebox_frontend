import { Button } from "@/components/ui/button";
import { Category } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "lucide-react";

export const categoryColumns = (
  onEdit: (category: Category) => void,
  onDelete: (id: string) => void
): ColumnDef<Category>[] => [
    {
      accessorKey: "name",
      header: "Tên thể loại",
      cell: ({ getValue }) => (
        <span className="font-medium text-white">{getValue() as string}</span>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex gap-2">
            <Button className="btn-edit" size="sm" onClick={() => onEdit(category)}>
              <EditIcon size={16} />
              Sửa
            </Button>
            <Button
              className="btn-delete"
              size="sm"
              variant="destructive"
              onClick={() => onDelete(category._id)}
            >
              <DeleteIcon size={16} />
              Xóa
            </Button>
          </div>
        );
      },
    },
  ];