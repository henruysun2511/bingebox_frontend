import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Button } from "@/components/ui/button";
import { Actor } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon } from "lucide-react";


export const actorColumns = (
  onEdit: (actor: Actor) => void,
  onDelete: (id: string) => void
): ColumnDef<Actor>[] => [
    {
      accessorKey: "name",
      header: "Tên diễn viên",
      cell: ({ row }) => {
        const avatarUrl = row.original.avatar;
        const name = row.original.name;
        return (
          <div className="flex items-center gap-5">
            <ImagePreview
              src={avatarUrl}
              alt={name}
              width="w-15"
              height="h-15"
              className="rounded-full"
            />
            {name}
          </div>

        );
      },
    },
    {
      accessorKey: "nationality",
      header: "Quốc tịch",
      cell: ({ getValue }) => getValue() || "-",
    },
    {
      accessorKey: "gender",
      header: "Giới tính",
      cell: ({ getValue }) => {
        const val = getValue() as string;
        const labels: Record<string, string> = {
          male: "Nam",
          female: "Nữ",
          other: "Khác"
        };
        return labels[val] || "-";
      }
    },
    {
      accessorKey: "bio",
      header: "Tiểu sử",
      cell: ({ getValue }) => {
        const bio = getValue() as string;
        return (
          <div
            className="max-w-[200px] truncate"
            title={bio} 
          >
            {bio || "-"}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const actor = row.original;
        return (
          <div className="flex gap-2">
            <Button className="btn-edit" size="sm" onClick={() => onEdit(actor)}>
              <EditIcon size={16} />
              Sửa
            </Button>
            <Button
              className="btn-delete"
              size="sm"
              variant="destructive"
              onClick={() => onDelete(actor._id)}
            >
              <DeleteIcon size={16} />
              Xóa
            </Button>
          </div>
        );
      },
    },
  ];