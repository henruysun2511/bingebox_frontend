import { ImagePreview } from "@/components/common/imagePreview/image-preview"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Blog } from "@/types/object"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { EditIcon, Eye, Trash2 } from "lucide-react"

export const blogColumns = (
    onEdit: (blog: Blog) => void,
    onDelete: (id: string) => void,
    onView: (id: string) => void,
    onChangePublish: (id: string, val: boolean) => void
): ColumnDef<Blog>[] => [
        {
            accessorKey: "thumbnail",
            header: "Hình ảnh",
            cell: ({ row }) => (
                <ImagePreview
                    src={row.original.thumbnail}
                    alt={row.original.title}
                    width="w-20"
                    height="h-12"
                    className="rounded-md object-cover border border-neutral-800"
                />
            ),
        },
        {
            accessorKey: "title",
            header: "Tiêu đề",
            cell: ({ row }) => (
                <div className="font-medium text-white truncate">
                    {row.original.title}
                </div>
            ),
        },
        {
            accessorKey: "author",
            header: "Tác giả",
            cell: ({ row }) => {
                const author = row.original.author;

                // Kiểm tra nếu author không tồn tại hoặc không phải object
                if (!author || typeof author !== "object") {
                    return <div className="text-neutral-500">—</div>;
                }

                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 border border-neutral-800">
                            <AvatarImage
                                src={author.avatar}
                                alt={author.username}
                                className="object-cover"
                            />
                            <AvatarFallback className="bg-neutral-800 text-[10px] text-neutral-400">
                                {author.username?.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-neutral-200">
                                {author.username}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "views",
            header: "Lượt xem",
        },
        {
            accessorKey: "createdAt",
            header: "Ngày tạo",
            cell: ({ row }) => {
                const date = new Date(row.original.createdAt);
                return (
                    <div className="text-neutral-400 text-sm">
                        {format(date, "dd/MM/yyyy")}
                    </div>
                )
            },
        },
        {
            accessorKey: "isPublished",
            header: "Xuất bản",
            cell: ({ row }) => {
                const blog = row.original

                return (
                    <Switch
                        checked={blog.isPublished}
                        onCheckedChange={(val) =>
                            onChangePublish(blog._id, val)
                        }
                        className="switch-custom"
                    />
                )
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const blog = row.original
                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="btn-custom"
                            onClick={() => onView(blog._id)}
                        >
                            <Eye size={16} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="btn-edit"
                            onClick={() => onEdit(blog)}
                        >
                            <EditIcon size={16} />
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="btn-delete"
                            onClick={() => onDelete(blog._id)}
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                )
            },
        },
    ]