import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRoleList } from "@/queries/useRoleQuery"; // Giả định bạn đã có hook này
import { useAssignRole } from "@/queries/useUserQuery";
import { User } from "@/types/object";
import { ColumnDef } from "@tanstack/react-table";
import { CoinsIcon, LockIcon, UnlockIcon } from "lucide-react";
import { toast } from "sonner";

export const userColumns = (
    onRedeem: (user: User) => void,
    onToggleBlock: (user: User) => void
): ColumnDef<User>[] => [
        {
            accessorKey: "username",
            header: "Người dùng",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-bold text-white">{row.original.username}</span>
                    <span className="text-xs text-neutral-500">{row.original.email}</span>
                </div>
            ),
        },
        {
            accessorKey: "role",
            header: "Quyền hạn",
            cell: ({ row }) => {
                const { data: roleRes } = useRoleList({});
                const { mutateAsync: assignRole } = useAssignRole(); // Dùng mutateAsync để bắt promise
                const roles = roleRes?.data || [];
                const currentRoleId = row.original.role?._id;

                const handleRoleChange = async (val: string) => {
                    if (val && val !== currentRoleId) {
                        toast.promise(assignRole({ id: row.original._id, roleId: val }), {
                            loading: 'Đang cập nhật quyền hạn...',
                            success: 'Cập nhật quyền hạn thành công!',
                            error: (err) => {
                                // Trả về message từ backend nếu có (AppError)
                                return err?.response?.data?.message || 'Không thể cập nhật quyền hạn';
                            },
                        });
                    }
                };

                return (
                    <Select
                        value={currentRoleId || ""}
                        onValueChange={handleRoleChange}
                    >
                        <SelectTrigger className="w-[140px] h-8 bg-neutral-900 border-neutral-700 text-white focus:ring-0">
                            <SelectValue placeholder="Chưa có quyền" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                            {roles.map((r: any) => (
                                <SelectItem
                                    className="select-item-custom focus:bg-neutral-800 focus:text-white"
                                    key={r._id}
                                    value={r._id}
                                >
                                    {r.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            }
        },
        {
            accessorKey: "currentPoints",
            header: "Điểm",
            cell: ({ getValue }) => <span className="text-yellow-500 font-mono">{getValue() as number}</span>
        },
        {
            accessorKey: "isBlocked",
            header: "Trạng thái",
            cell: ({ getValue }) => (
                <Badge variant={getValue() ? "destructive" : "outline"}>
                    {getValue() ? "Đã khóa" : "Hoạt động"}
                </Badge>
            )
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button className="btn-edit" size="sm" onClick={() => onRedeem(row.original)} title="Cộng điểm">
                        <CoinsIcon size={16} />
                    </Button>
                    <Button
                        className="btn-delete"
                        size="sm"
                        variant={row.original.isBlocked ? "default" : "destructive"}
                        onClick={() => onToggleBlock(row.original)}
                    >
                        {row.original.isBlocked ? <UnlockIcon size={16} /> : <LockIcon size={16} />}
                    </Button>
                </div>
            ),
        },
    ];