import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { useRoomList } from "@/queries/useRoomQuery"; // Giả định bạn đã có query này
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormatRoom, Room } from "@/types/object";

interface RoomInfoProps {
    onRoomSelect: (room: Room | null) => void;
}

export default function RoomInfo({ onRoomSelect }: RoomInfoProps) {
    // State cho Cinema
    const [openCinema, setOpenCinema] = useState(false);
    const [selectedCinema, setSelectedCinema] = useState<{ id: string; name: string } | null>(null);
    const [searchCinema, setSearchCinema] = useState("");
    const debouncedCinemaSearch = useDebounce(searchCinema, 500);

    // State cho Room
    const [openRoom, setOpenRoom] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);


    // 1. Fetch danh sách Cinema
    const { data: cinemasData, isPending: isCinemaPending } = useCinemaList({
        limit: 10,
        name: debouncedCinemaSearch,
    });

    // 2. Fetch danh sách Room 
    const { data: roomsData, isPending: isRoomPending } = useRoomList({
        cinemaId: selectedCinema?.id || "",
    });

    // Logic: Nếu đang chọn room mà đổi cinema thì reset room
    useEffect(() => {
        setSelectedRoom(null);
    }, [selectedCinema?.id]);

    return (
        <div className="flex flex-col gap-8 p-6 rounded-xl w-full">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* --- POPOVER CHỌN RẠP --- */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Rạp phim
                    </label>

                    <Popover open={openCinema} onOpenChange={setOpenCinema}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between form-input-custom text-white h-11 rounded-lg border-neutral-800 bg-neutral-900 hover:bg-neutral-800"
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

                {/* --- POPOVER CHỌN PHÒNG --- */}
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                        Phòng chiếu
                    </label>

                    <Popover open={openRoom} onOpenChange={setOpenRoom}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                disabled={!selectedCinema}
                                className={cn(
                                    "w-full justify-between form-input-custom text-white h-11 rounded-lg border-neutral-800 bg-neutral-900 hover:bg-neutral-800",
                                    !selectedCinema && "opacity-50 cursor-not-allowed"
                                )}
                            >
                                <span className="truncate">
                                    {!selectedCinema
                                        ? "Vui lòng chọn rạp trước"
                                        : selectedRoom
                                            ? selectedRoom.name
                                            : "Chọn phòng..."}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-[240px] p-0 bg-neutral-900 border-neutral-800 rounded-xl">
                            <Command>
                                <CommandInput placeholder="Tìm phòng..." />
                                <CommandList>
                                    {isRoomPending && (
                                        <div className="p-4 flex justify-center">
                                            <Loader2 className="animate-spin h-4 w-4" />
                                        </div>
                                    )}
                                    <CommandEmpty>Không có phòng nào.</CommandEmpty>

                                    <CommandGroup heading="Phòng khả dụng">
                                        {roomsData?.data.map((room) => (
                                            <CommandItem
                                                key={room._id}
                                                onSelect={() => {
                                                    setSelectedRoom(room);
                                                    setOpenRoom(false);
                                                    onRoomSelect(room);
                                                }}
                                                className="text-white cursor-pointer hover:bg-neutral-800 transition-colors"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedRoom?._id === room._id
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {room.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

            </div>

            {/* --- THÔNG TIN PHÒNG --- */}

            <div className="mt-2 p-5 border border-zinc-800 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300 bg-neutral-900/30">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <div className="w-2 h-6 bg-blue rounded-full" />
                        Thông tin phòng: {selectedRoom ? selectedRoom.name : "N/A"}
                    </h3>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Rạp chiếu</p>
                        <p className="text-sm text-zinc-200">{selectedCinema?.name || "N/A"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Loại phòng</p>
                        <p className="text-sm text-zinc-200">{selectedRoom ? (selectedRoom.format as FormatRoom).name : "Chưa có định dạng"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Số hàng</p>
                        <p className="text-sm text-zinc-200">{selectedRoom ? selectedRoom.seatLayout?.rows : "0"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Số cột</p>
                        <p className="text-sm text-zinc-200">{selectedRoom ? selectedRoom.seatLayout?.columns : "0"}</p>
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 uppercase font-semibold">Trạng thái</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <p className="text-sm text-zinc-200">{selectedRoom ? selectedRoom.status : "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>


    );
}