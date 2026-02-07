"use client";
import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { MovieSortType } from "@/constants/sort";
import { useDebounce } from "@/hooks/useDebounce";
import { useAdminMovieList, useDeleteMovie } from "@/queries/useMovieQuery";
import { Movie } from "@/types/object";
import { handleError } from "@/utils/error";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { movieColumns } from "./movie-column";
import { MovieDetail } from "./movie-detail";
import { MovieDialog } from "./movie-dialog";
import { MovieFilter } from "./movie-filter";

export default function MoviePage() {
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<MovieSortType>("createdAt");

    const [status, setStatus] = useState("all");
    const [agePermission, setAgePermission] = useState("all");
    const [releaseDate, setReleaseDate] = useState("");
    const [categories, setCategories] = useState<string[]>([]);

    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState<any>();
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState<Movie | undefined>();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);

    const { data, isPending } = useAdminMovieList({
        page,
        limit: 10,
        name: useDebounce(search, 500),
        sort,
        status: status !== "all" ? status : undefined,
        agePermission: agePermission !== "all" ? agePermission : undefined,
        releaseDate: releaseDate || undefined,
        categoryIds: categories.length ? categories : undefined,
    });
    console.log(data);

    const deleteMovie = useDeleteMovie();

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        deleteMovie.mutate(idToDelete, {
            onSuccess: () => {
                toast.success("Xóa phim thành công");
                setIsConfirmOpen(false);
            },
            onError: (err) => handleError(err),
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Phim</h1>
                <Button className="btn-custom" onClick={() => setOpen(true)}>
                    <Plus size={16} /> Thêm Phim
                </Button>
            </div>

            <MovieFilter
                search={search}
                setSearch={setSearch}
                sort={sort}
                setSort={setSort}
                status={status}
                setStatus={setStatus}
                agePermission={agePermission}
                setAgePermission={setAgePermission}
                releaseDate={releaseDate}
                setReleaseDate={setReleaseDate}
                categories={categories}
                setCategories={setCategories}
                setPage={setPage}
            />


            <DataTable
                data={data?.data ?? []}
                columns={movieColumns(
                    (m) => { // Tham số 1: onEdit
                        setSelected(m);
                        setOpen(true);
                    },
                    (id) => { // Tham số 2: onDelete
                        setIdToDelete(id);
                        setIsConfirmOpen(true);
                    },
                    (m) => { // Tham số 3: onView
                        setSelectedDetail(m);
                        setDetailOpen(true);
                    }
                )}
                loading={isPending}
            />

            <DataPagination
                page={data?.pagination?.page ?? 1}
                totalPages={data?.pagination?.totalPages ?? 1}
                onPageChange={setPage}
            />

            <MovieDetail
                open={detailOpen}
                movie={selectedDetail}
                onClose={() => {
                    setDetailOpen(false);
                    setSelectedDetail(undefined);
                }}
            />

            <MovieDialog
                open={open}
                movie={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined);
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteMovie.isPending}
            />
        </div>
    );
}