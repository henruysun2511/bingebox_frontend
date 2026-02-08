"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BASE_STATUS_LABEL } from "@/constants/filter";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { useMovieList } from "@/queries/useMovieQuery";
import { useRoomList } from "@/queries/useRoomQuery";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface ShowtimeFilterProps {
    filters: {
        date?: Date;
        movieId?: string;
        roomId?: string;
        cinemaId?: string;
        status?: string;
    };
    setFilters: (val: any) => void;
    setPage: (page: number) => void;
}

export function ShowtimeFilter({ filters, setFilters, setPage }: ShowtimeFilterProps) {
    // Fetch dữ liệu cho các Select
    const { data: moviesData } = useMovieList({ limit: 30 });
    const { data: cinemasData } = useCinemaList({ limit: 20 });
    const { data: roomsData } = useRoomList(
        { cinemaId: filters.cinemaId }
    );

    const updateFilter = (key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
        setPage(1);
    };


    return (
        <div className="flex flex-wrap gap-3 items-end rounded-lg">
            {/* Lọc theo Ngày */}

            <div className="space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Ngày chiếu</span>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-[160px] justify-start form-input-custom text-white font-normal"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.date
                                ? format(new Date(filters.date), "dd/MM/yyyy")
                                : "Chọn ngày"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-800">
                        <Calendar
                            mode="single"
                            selected={filters.date ? new Date(filters.date) : undefined}
                            onSelect={(d) =>
                                updateFilter("date", d ? format(d, "yyyy-MM-dd") : "")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>


            {/* Lọc theo Phim */}
            <div className="space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Phim</span>
                <Select value={filters.movieId} onValueChange={(val) => updateFilter("movieId", val)}>
                    <SelectTrigger className="select-trigger-custom">
                        <SelectValue placeholder="Tất cả phim" />
                    </SelectTrigger>
                    <SelectContent className="select-content-custom">
                        <SelectItem value="all">Tất cả phim</SelectItem>
                        {moviesData?.data.map((m) => (
                            <SelectItem className="select-item-custom" key={m._id} value={m._id}>{m.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lọc theo Rạp */}
            <div className="space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Rạp</span>
                <Select
                    value={filters.cinemaId}
                    onValueChange={(val) => {
                        updateFilter("cinemaId", val);
                        updateFilter("roomId", "all"); // Reset phòng khi đổi rạp
                    }}
                >
                    <SelectTrigger className="select-trigger-custom">
                        <SelectValue placeholder="Tất cả rạp" />
                    </SelectTrigger>
                    <SelectContent className="select-content-custom">
                        <SelectItem value="all">Tất cả rạp</SelectItem>
                        {cinemasData?.data.map((c) => (
                            <SelectItem className="select-item-custom" key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lọc theo Phòng - Chỉ enable khi chọn rạp */}
            <div className="space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Phòng</span>
                <Select
                    value={filters.roomId}
                    onValueChange={(val) => updateFilter("roomId", val)}
                    disabled={!filters.cinemaId || filters.cinemaId === "all"}
                >
                    <SelectTrigger className="select-trigger-custom">
                        <SelectValue placeholder="Chọn phòng" />
                    </SelectTrigger>
                    <SelectContent className="select-content-custom">
                        <SelectItem value="all">Tất cả phòng</SelectItem>
                        {roomsData?.data.map((r) => (
                            <SelectItem className="select-item-custom" key={r._id} value={r._id}>{r.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lọc theo Trạng thái */}
            <div className="space-y-2">
                <span className="text-xs text-neutral-500 font-medium">Trạng thái</span>
                <Select
                    value={filters.status}
                    onValueChange={(val) => updateFilter("status", val)}
                >
                    <SelectTrigger className="w-[140px] select-trigger-custom">
                        <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent className="select-content-custom">
                        <SelectItem value="all" className="select-item-custom">
                            Tất cả
                        </SelectItem>
                        {BASE_STATUS_LABEL.map((status) => (
                            <SelectItem
                                key={status.value}
                                value={status.value}
                                className="select-item-custom"
                            >
                                {status.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Nút Reset */}

        </div>
    );
}