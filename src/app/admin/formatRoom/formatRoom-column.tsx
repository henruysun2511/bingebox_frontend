import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Button } from "@/components/ui/button";
import { FormatRoom } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "lucide-react";

export const formatRoomColumns = (
  onEdit: (format: FormatRoom) => void,
  onDelete: (id: string) => void
): ColumnDef<FormatRoom>[] => [
    {
      accessorKey: "image",
      header: "Hình ảnh",
      cell: ({ row }) => (
        <ImagePreview
          src={row.original.image || ""}
          alt={row.original.name}
          width="w-16"
          height="h-10"
          className="rounded object-cover border border-neutral-800"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Tên định dạng",
      cell: ({ row }) => <span className="font-bold text-white">{row.original.name}</span>,
    },
    {
      accessorKey: "description",
      header: "Mô tả",
      cell: ({ getValue }) => <div className="max-w-[300px] truncate">{getValue() as string || "-"}</div>,
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