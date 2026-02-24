import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { EditIcon, TrashIcon } from "lucide-react";

export const foodColumns = (onEdit: (f: any) => void, onDelete: (id: string) => void): ColumnDef<any>[] => [
    {
        accessorKey: "image",
        header: "Ảnh",
        cell: ({ row }) => (
            <ImagePreview src={row.original.image} alt={row.original.name} width="w-16" height="h-16" className="rounded-lg object-cover" />
        )
    },
    { accessorKey: "name", header: "Tên món ăn" },
    { 
        accessorKey: "price", 
        header: "Giá tiền",
        cell: ({ row }) => <span className="text-emerald-500 font-medium">{row.original.price.toLocaleString()}đ</span>
    },
    {
        id: "actions",
        header: "Hành động",
        cell: ({ row }) => (
            <div className="flex gap-2">
                <Button size="sm" className="btn-edit" onClick={() => onEdit(row.original)}><EditIcon size={14} /></Button>
                <Button size="sm" className="btn-delete" variant="destructive" onClick={() => onDelete(row.original._id)}><TrashIcon size={14} /></Button>
            </div>
        )
    }
];