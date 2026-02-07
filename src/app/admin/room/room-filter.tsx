"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface RoomFilterProps {
    search: string;
    setSearch: (val: string) => void;
    cinemaId: string;
    setCinemaId: (val: string) => void;
    setPage: (page: number) => void;
}

export function RoomFilter({ search, setSearch, cinemaId, setCinemaId, setPage }: RoomFilterProps) {
    const [openCinema, setOpenCinema] = useState(false);
    const [searchCinema, setSearchCinema] = useState("");
    const debouncedSearch = useDebounce(searchCinema, 500);

    // Fetch danh sách rạp để lọc
    const { data: cinemasData, isPending: isCinemaPending } = useCinemaList({
        limit: 10,
        name: debouncedSearch,
    });

    // Tìm tên rạp đang được chọn để hiển thị trên Button label
    const selectedCinemaName = cinemasData?.data.find((c) => c._id === cinemaId)?.name;

    return (
        <div className="flex flex-wrap gap-3 items-center">
            {/* 1. Tìm kiếm tên phòng */}
            <Input
                placeholder="Tìm tên phòng..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="max-w-xs pl-9 form-input-custom"
            />


            {/* 2. Lọc theo Rạp (Sử dụng Combobox Popover) */}
            <Popover open={openCinema} onOpenChange={setOpenCinema}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openCinema}
                        className={cn(
                            "!w-[250px] justify-between form-input-custom font-normal text-white",
                            !cinemaId && "text-neutral-400"
                        )}
                    >
                        <span className="truncate">
                            {cinemaId ? selectedCinemaName || "Tất cả rạp" : "Tất cả rạp"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="!w-[250px] p-0 bg-neutral-900 border-neutral-800 shadow-xl">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder="Tìm rạp..."
                            className="text-white"
                            value={searchCinema}
                            onValueChange={setSearchCinema}
                        />
                        <CommandList className="custom-scrollbar">
                            {isCinemaPending && (
                                <div className="flex items-center justify-center p-4">
                                    <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                                </div>
                            )}
                            <CommandEmpty className="p-4 text-sm text-neutral-500">
                                Không tìm thấy rạp nào.
                            </CommandEmpty>

                            <CommandGroup >
                                {/* Option để xóa lọc */}
                                <CommandItem
                                    value="all"
                                    onSelect={() => {
                                        setCinemaId("");
                                        setPage(1);
                                        setOpenCinema(false);
                                    }}
                                    className="text-white hover:bg-neutral-800 cursor-pointer"
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            cinemaId === "" ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    Tất cả rạp
                                </CommandItem>

                                {cinemasData?.data.map((cinema) => (
                                    <CommandItem
                                        key={cinema._id}
                                        value={cinema._id}
                                        onSelect={() => {
                                            setCinemaId(cinema._id);
                                            setPage(1);
                                            setOpenCinema(false);
                                        }}
                                        className="text-white hover:bg-neutral-800 cursor-pointer"
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                cinemaId === cinema._id ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        <span className="truncate">{cinema.name}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}