"use client";
import { DataTable } from "@/components/admin/table/data-table";
import { ConfirmDialog } from "@/components/common/confirm/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { useDeleteShowtime, useShowtimesGroupByRoom } from "@/queries/useShowtimeQuery";
import { Showtime } from "@/types/object";
import { handleError } from "@/utils/error";
import { Check, ChevronsUpDown, Loader2, Monitor, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ShowtimeDialog } from "../showtime/showtime-dialog";
import { compactShowtimeColumns } from "./showtime-column";
import { ShowtimeFilter } from "./showtime-filter";

export default function ShowtimeGroupByRoomPage() {
    // --- State quản lý Form ---
    const [open, setOpen] = useState(false); // Mở ShowtimeDialog
    const [selected, setSelected] = useState<Showtime | undefined>(); // Dữ liệu để sửa

    // --- State quản lý Xóa ---
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<string | null>(null);
    const deleteShowtime = useDeleteShowtime();

    const [openCinema, setOpenCinema] = useState(false);
    const [selectedCinema, setSelectedCinema] = useState<{ id: string; name: string } | null>(null);
    const [searchCinema, setSearchCinema] = useState("");
    const debouncedCinemaSearch = useDebounce(searchCinema, 500);

    const { data: cinemasData, isPending: isCinemaPending } = useCinemaList({
        limit: 10,
        name: debouncedCinemaSearch,
    });

    const [filters, setFilters] = useState({
        date: undefined as Date | undefined,
    });

    const { data: showtimeData, isPending } = useShowtimesGroupByRoom(
        selectedCinema?.id || "", { date: filters.date ? filters.date : undefined, });

    const showtimes = showtimeData?.data || [];


    const handleEdit = (showtime: Showtime) => {
        setSelected(showtime);
        setOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteShowtime.mutateAsync(idToDelete);
            toast.success("Xóa lịch chiếu thành công");
            setIsConfirmOpen(false);
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className="space-y-6 p-6 ">
            {/* Phần Header / Filter giữ nguyên */}
            <div className="flex flex-col gap-4">
                <div className="flex items-end gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-neutral-400 uppercase">Rạp phim</label>
                        <Popover open={openCinema} onOpenChange={setOpenCinema}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-[320px] justify-between form-input-custom text-white h-9 rounded-lg border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
                                >
                                    <span className="truncate">
                                        {selectedCinema ? selectedCinema.name : "Chọn rạp phim..."}
                                    </span>
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>

                            <PopoverContent className="w-[320px] p-0 bg-neutral-900 border-neutral-800 rounded-xl">
                                <Command shouldFilter={false}>
                                    <CommandInput
                                        placeholder="Tìm rạp..."
                                        value={searchCinema}
                                        onValueChange={setSearchCinema}
                                    />
                                    <CommandList>
                                        {isCinemaPending && (
                                            <div className="p-4 flex justify-center">
                                                <Loader2 className="animate-spin h-4 w-4" />
                                            </div>
                                        )}
                                        <CommandEmpty>Không tìm thấy rạp.</CommandEmpty>

                                        <CommandGroup heading="Danh sách rạp">
                                            {cinemasData?.data.map((cinema) => (
                                                <CommandItem
                                                    key={cinema._id}
                                                    onSelect={() => {
                                                        setSelectedCinema({ id: cinema._id, name: cinema.name });
                                                        setOpenCinema(false);
                                                    }}
                                                    className="text-white cursor-pointer hover:bg-neutral-800 transition-colors"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedCinema?.id === cinema._id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {cinema.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <ShowtimeFilter filters={filters} setFilters={setFilters} />
                    <Button className="btn-custom" onClick={() => setOpen(true)}>
                        <Plus size={16} className="mr-2" /> Thêm Lịch chiếu
                    </Button>
                </div>
            </div>

            {/* Render danh sách Card theo phòng */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {
                    showtimes.length > 0 ? (
                        showtimes?.map((roomGroup) => (
                            <div
                                key={roomGroup._id}
                                className="bg-neutral-900/50 border border-neutral-800 rounded-xl overflow-hidden"
                            >
                                {/* Header của Card */}
                                <div className="bg-neutral-800/50 px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <Monitor size={18} className="text-blue-400" />
                                        <h3 className="font-bold text-white">{roomGroup.roomName}</h3>
                                    </div>
                                    <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full uppercase tracking-tighter font-bold">
                                        {roomGroup.showtimes.length} Suất chiếu
                                    </span>
                                </div>

                                {/* Table bên trong Card */}
                                <div className="p-2">
                                    <DataTable
                                        columns={compactShowtimeColumns(
                                            (showtime) => {
                                                const enrichedShowtime = {
                                                    ...showtime,
                                                    room: roomGroup._id,
                                                    cinema: selectedCinema?.id
                                                };
                                                handleEdit(enrichedShowtime);
                                            },
                                            handleConfirmDelete
                                        )}
                                        data={roomGroup.showtimes}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="">Vui lòng chọn rạp</div>
                    )

                }
            </div>

            {!isPending && showtimes?.length === 0 && (
                <div className="text-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-xl">
                    Không có suất chiếu nào cho rạp này trong ngày đã chọn.
                </div>
            )}

            <ShowtimeDialog
                open={open}
                showtime={selected}
                onClose={() => {
                    setOpen(false);
                    setSelected(undefined);
                }}
            />

            <ConfirmDialog
                open={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={deleteShowtime.isPending}
            />
        </div>


    );
}