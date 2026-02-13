import { ImagePreview } from "@/components/common/imagePreview/image-preview";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AgePermissionTypeEnum, MovieStatusEnum } from "@/constants/enum";
import { AGE_PERMISSION_OPTIONS, MOVIE_STATUS_OPTIONS, SUBTITLE_TYPE_OPTIONS } from "@/constants/filter";
import { Movie } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { DeleteIcon, EditIcon, EyeIcon } from "lucide-react";

export const movieColumns = (
    onEdit: (movie: Movie) => void,
    onDelete: (id: string) => void,
    onView?: (movie: Movie) => void
): ColumnDef<Movie>[] => [
        {
            accessorKey: "poster",
            header: "Poster",
            cell: ({ row }) => (
                <ImagePreview
                    src={row.original.poster}
                    alt={row.original.name}
                    width="w-18"
                    height="h-28"
                    className="rounded-md shadow-sm border border-neutral-800"
                />
            ),
        },
        {
            accessorKey: "name",
            header: "Tên phim",
            cell: ({ row }) => (
                <span className="font-bold text-white line-clamp-2 max-w-[200px]">
                    {row.original.name}
                </span>
            ),
        },
        {
            accessorKey: "duration",
            header: "Thời lượng",
            cell: ({ getValue }) => (
                <span className="text-neutral-300 font-medium">
                    {getValue() as number} phút
                </span>
            ),
        },
        {
            accessorKey: "releaseDate",
            header: "Ngày chiếu",
            cell: ({ getValue }) => {
                const date = getValue() as string;
                return date ? new Date(date).toLocaleDateString("vi-VN") : "-";
            },
        },
        {
            accessorKey: "agePermission",
            header: "Độ tuổi",
            cell: ({ getValue }) => {
                const value = getValue() as AgePermissionTypeEnum;

                // Tìm option tương ứng trong hằng số
                const option = AGE_PERMISSION_OPTIONS.find(opt => opt.value === value);

                return (
                    <Badge
                        variant="outline"
                        className={`${option?.className || "border-neutral-500 text-neutral-500"} font-bold`}
                    >
                        {option?.shortLabel || value}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "subtitle",
            header: "Phụ đề",
            cell: ({ getValue }) => {
                const values = getValue() as string[] || []; 

                const labels = values.map((val) => {
                    const option = SUBTITLE_TYPE_OPTIONS.find((opt) => opt.value === val);
                    return option?.label || val;
                });

                if (labels.length === 0) return <span className="text-neutral-500">N/A</span>;

                return (
                    <div className="flex flex-wrap gap-1">
                        {labels.map((label, index) => (
                            <span
                                key={index}
                                className="px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded text-[11px] whitespace-nowrap"
                            >
                                {label}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "categories",
            header: "Thể loại",
            cell: ({ row }) => {
                const categories = row.original.categories as any[];
                return (
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {categories?.map((cat) => (
                            <span
                                key={cat._id}
                                className="text-[11px] bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded border border-neutral-700 whitespace-nowrap"
                            >
                                {cat.name}
                            </span>
                        ))}
                    </div>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ getValue }) => {
                const value = getValue() as MovieStatusEnum;
                const option = MOVIE_STATUS_OPTIONS.find((opt) => opt.value === value);

                return (
                    <Badge className={option?.className}>
                        {option?.label || "Không xác định"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button className="btn-edit !bg-blue-500" size="sm" onClick={() => onView?.(row.original)}>
                        <EyeIcon size={16} />
                    </Button>

                    <Button className="btn-edit" size="sm" onClick={() => onEdit(row.original)}>
                        <EditIcon size={16} />
                    </Button>

                    <Button
                        className="btn-delete"
                        size="sm"
                        variant="destructive"
                        onClick={() => onDelete(row.original._id)}
                    >
                        <DeleteIcon size={16} />
                    </Button>
                </div>
            ),
        },
    ];