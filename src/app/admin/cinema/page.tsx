"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { CinemaSortType } from "@/constants/sort";
import { useDebounce } from "@/hooks/useDebounce";
import { useCinemaList, useDeleteCinema } from "@/queries/useCinemaQuery";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cinemaColumns } from "./cinema-column";
import { CinemaDetail } from "./cinema-detail";
import { CinemaDialog } from "./cinema-dialog";
import { CinemaFilter } from "./cinema-filter";

export default function CinemaPage() {
    const [search, setSearch] = useState("");
    const [province, setProvince] = useState("all");
    const [sort, setSort] = useState<CinemaSortType>("createdAt");
    const [page, setPage] = useState(1);

    const debouncedSearch = useDebounce(search, 500);

    // Dialog state
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any | undefined>();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [idToView, setIdToView] = useState<string | undefined>();

    // Fetch data
    const { data, isPending } = useCinemaList({
        page,
        limit: 10,
        name: debouncedSearch,
        province: province === "all" ? undefined : province,
        sort
    });
    console.log(data);

    const cinemas = data?.data ?? [];
    const pagination = data?.pagination;

    const deleteCinema = useDeleteCinema();

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteCinema.mutateAsync(idToDelete);
            toast.success("Xóa rạp thành công");
            setIsConfirmOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <CinemaFilter
                search={search} setSearch={setSearch}
                province={province} setProvince={setProvince}
                sort={sort} setSort={setSort}
                setPage={setPage}
            />

            <Button className="btn-custom" onClick={() => { setSelected(undefined); setOpen(true); }}>
                <Plus size={16} /> Thêm Rạp
            </Button>


            <DataTable
                data={cinemas}
                columns={cinemaColumns(
                    (cinema) => { setSelected(cinema); setOpen(true); },
                    (id) => { setIdToDelete(id); setIsConfirmOpen(true); },
                    (id) => {
                        setIdToView(id);
                        setDetailOpen(true);
                    }
                )}
                loading={isPending}
            />

            <DataPagination
                page={pagination?.page ?? 1}
                totalPages={pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            <CinemaDialog
                open={open}
                cinema={selected}
                onClose={() => { setOpen(false); setSelected(undefined); }}
            />

            <CinemaDetail
                open={detailOpen}
                cinemaId={idToView}
                onClose={() => {
                    setDetailOpen(false);
                    setIdToView(undefined);
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteCinema.isPending}
            />
        </div>
    );
}