"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { ActorSortType } from "@/constants/sort";
import { useDebounce } from "@/hooks/useDebounce";
import { useActorList, useDeleteActor } from "@/queries/useActorQuery";
import { Actor } from "@/types/object";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../../components/admin/table/data-table";
import { actorColumns } from "./actor-column";
import { ActorDialog } from "./actor-dialog";
import { ActorFilter } from "./actor-filter";


export default function ActorPage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<ActorSortType>("createdAt");
    const [page, setPage] = useState(1);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const [selected, setSelected] = useState<Actor | undefined>();
    const [open, setOpen] = useState(false);

    const { data, isPending } = useActorList({
        sort,
        page,
        limit: 10,
        name: useDebounce(search, 500)
    });

    const actors = data?.data ?? [];
    const pagination = data?.pagination;

    const deleteActor = useDeleteActor();

    const openConfirm = (id: string) => {
        setIdToDelete(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;

        deleteActor.mutate(idToDelete, {
            onSuccess: () => {
                toast.success("Xóa diễn viên thành công");
                setIsConfirmOpen(false);
                setIdToDelete(null);
            },
            onError: (error: any) => {
                handleError(error);
            }
        });
    };

    return (
        <div className="space-y-4">
            {/* FILTER BAR */}
            <div className="flex justify-between items-center">
                <ActorFilter
                    search={search}
                    setSearch={setSearch}
                    sort={sort}
                    setSort={setSort}
                    setPage={setPage}
                />
                <Button className="btn-custom" onClick={() => setOpen(true)}>
                    <Plus size={16} />
                    Thêm Actor
                </Button>
            </div>


            {/* TABLE */}
            <DataTable
                data={actors}
                columns={actorColumns(
                    (actor) => { setSelected(actor); setOpen(true); },
                    (id) => openConfirm(id)
                )}
                loading={isPending}
            />

            {/* PAGINATION */}
            <DataPagination
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            {/* MODAL */}
            <ActorDialog
                open={open}
                actor={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined);
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteActor.isPending}
            />
        </div>
    );
}