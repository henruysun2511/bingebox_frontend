"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserSortType } from "@/constants/sort";
import { useDebounce } from "@/hooks/useDebounce";
import { useRedeemPoints, useToggleBlockUser, useUserList } from "@/queries/useUserQuery";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { userColumns } from "./user-column";
import { UserDialog } from "./user-dialog";
import { UserFilter } from "./user-filter";

export default function UserManagementPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<UserSortType>("createdAt");
    const [role, setRole] = useState("all");
    const [isBlocked, setIsBlocked] = useState("all");
    const [open, setOpen] = useState(false);

    const debouncedSearch = useDebounce(search, 500);

    // States cho Redeem & Block
    const [pointsToRedeem, setPointsToRedeem] = useState(0);
    const [userForPoints, setUserForPoints] = useState<any>(null);
    const [userToBlock, setUserToBlock] = useState<any>(null);

    const { data, isPending } = useUserList({
        page,
        sort,
        username: debouncedSearch || undefined,
        role: role !== "all" ? role : undefined,
        isBlocked: isBlocked !== "all" ? isBlocked : undefined,
    });

    const blockMutation = useToggleBlockUser();
    const redeemMutation = useRedeemPoints();

    const handleRedeemSubmit = () => {
        if (!userForPoints) return;
        redeemMutation.mutate({ id: userForPoints._id, points: pointsToRedeem }, {
            onSuccess: () => {
                setUserForPoints(null);
                setPointsToRedeem(0);
            },
            onError: (err) => handleError(err),
        });
    };

    return (
        <div className="space-y-4 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    Người dùng
                </h1>
                <Button className="btn-custom" onClick={() => { setOpen(true); }}>
                    <Plus size={16} className="mr-2" /> Thêm người dùng
                </Button>
            </div>

            <UserFilter
                search={search} setSearch={setSearch}
                sort={sort} setSort={setSort}
                role={role} setRole={setRole}
                isBlocked={isBlocked} setIsBlocked={setIsBlocked}
                setPage={setPage}
            />

            <DataTable
                loading={isPending}
                data={data?.data ?? []}
                columns={userColumns(
                    (user) => setUserForPoints(user),
                    (user) => setUserToBlock(user)
                )}
            />

            <DataPagination
                page={data?.pagination?.page ?? 1}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            {/* Dialog Cộng/Trừ Điểm */}
            <Dialog open={!!userForPoints} onOpenChange={() => setUserForPoints(null)}>
                <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Điều chỉnh điểm cho [{userForPoints?.username}]</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <p className="text-sm text-neutral-400 text-center italic">
                            Nhập số điểm trừ
                        </p>
                        <Input
                            type="number"
                            value={pointsToRedeem}
                            onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                            className="form-input-custom text-center text-2xl h-16"
                        />
                    </div>
                    <DialogFooter>
                        <Button className="btn-custom w-full h-12" onClick={handleRedeemSubmit} disabled={redeemMutation.isPending}>
                            {redeemMutation.isPending ? "Đang xử lý..." : "Xác nhận thay đổi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <UserDialog
                open={open}
                onClose={() => setOpen(false)}
            />

            {/* Confirm Khóa/Mở khóa */}
            <ConfirmDialog
                open={!!userToBlock}
                onClose={() => setUserToBlock(null)}
                title={userToBlock?.isBlocked ? "Mở khóa tài khoản?" : "Khóa tài khoản này?"}
                description={`Bạn đang thực hiện thay đổi trạng thái hoạt động của người dùng ${userToBlock?.username}.`}
                onConfirm={() => blockMutation.mutate({ id: userToBlock._id, isBlocked: !userToBlock.isBlocked }, {
                    onSuccess: () => { setUserToBlock(null); toast.success(`Tài khoản ${userToBlock?.username} đã được ${!userToBlock.isBlocked ? "khóa" : "mở khóa"}`); },
                    onError: (err) => handleError(err),
                })}
                isLoading={blockMutation.isPending}
            />
        </div>
    );
}