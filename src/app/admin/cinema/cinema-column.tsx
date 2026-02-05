import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Button } from "@/components/ui/button";
import { Cinema } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon, EyeIcon, MapPin } from "lucide-react";

export const cinemaColumns = (
    onEdit: (cinema: Cinema) => void,
    onDelete: (id: string) => void,
    onView?: (id: string) => void
): ColumnDef<Cinema>[] => [
        {
            accessorKey: "image",
            header: "Hình ảnh",
            cell: ({ row }) => (
                <ImagePreview
                    src={row.original.image}
                    alt={row.original.name}
                    width="w-20"
                    height="h-12"
                    className="rounded-md object-cover border border-neutral-800"
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Tên rạp",
            cell: ({ row }) => <span className="font-bold text-white">{row.original.name}</span>,
        },
        {
            accessorKey: "location",
            header: "Địa chỉ",
            cell: ({ getValue }) => (
                <div className="flex items-center gap-2 text-neutral-400 max-w-[250px]">
                    <MapPin size={14} className="flex-shrink-0 text-blue-500" />
                    <span className="truncate text-sm">{getValue() as string}</span>
                </div>
            ),
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const cinema = row.original;
                return (
                    <div className="flex gap-2">
                        <Button className="btn-edit !bg-blue-500" size="sm" onClick={() => onView?.(cinema._id)}>
                            <EyeIcon size={16} />
                        </Button>
                        <Button
                            className="btn-edit"
                            size="sm"
                            onClick={() => onEdit(cinema)}
                        >
                            <EditIcon size={16} />
                            Sửa
                        </Button>
                        <Button
                            className="btn-delete"
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(cinema._id)}
                        >
                            <DeleteIcon size={16} />
                            Xóa
                        </Button>
                    </div>
                );
            },
        },
    ];