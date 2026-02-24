import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { BaseStatusEnum } from "@/constants/enum"
import { Voucher } from "@/types/object"
import { ColumnDef } from "@tanstack/react-table"
import { DeleteIcon, EditIcon } from "lucide-react"

export const voucherColumns = (
    onEdit: (voucher: Voucher) => void,
    onDelete: (id: string) => void,
    onChangeStatus: (id: string, status: string) => void
): ColumnDef<Voucher>[] => [
        {
            accessorKey: "name",
            header: "Tên voucher",
        },
        {
            accessorKey: "code",
            header: "Code",
        },
        {
            header: "Thời gian",
            cell: ({ row }) => {
                const v = row.original
                return (
                    <div className="text-sm">
                        <div>
                            {new Date(v.startTime).toLocaleDateString()}
                        </div>
                        <div>
                            → {new Date(v.endTime).toLocaleDateString()}
                        </div>
                    </div>
                )
            },
        },
        {
            header: "Giảm tối đa",
            cell: ({ row }) => {
                return (
                    <div>
                        {row.original.maxDiscountAmount.toLocaleString()}đ
                    </div>
                )
            },
        },
        {
            header: "Đã dùng",
            cell: ({ row }) => {
                const v = row.original
                return `${v.usedCount}/${v.maxUsage}`
            },
        },
        {
            accessorKey: "description",
            header: "Mô tả",
            cell: ({ row }) => {
                const description = row.original.description

                return (
                    <div className="!max-w-[250px] truncate text-sm text-neutral-300">
                        {description || "-"}
                    </div>
                )
            },
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => {
                const room = row.original;
                const isActive = room.status === BaseStatusEnum.ACTIVE;

                return (
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isActive}
                            onCheckedChange={(checked) => {
                                const newStatus = checked ? BaseStatusEnum.ACTIVE : BaseStatusEnum.INACTIVE;
                                onChangeStatus(room._id, newStatus);
                            }}
                            className="switch-custom"
                        />
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const voucher = row.original
                return (
                    <div className="flex gap-2">
                        <Button
                            className="btn-edit"
                            size="sm"
                            onClick={() => onEdit(voucher)}
                        >
                            <EditIcon size={16} />
                            Sửa
                        </Button>

                        <Button
                            className="btn-delete"
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(voucher._id)}
                        >
                            <DeleteIcon size={16} />
                            Xóa
                        </Button>
                    </div>
                )
            },
        },
    ]