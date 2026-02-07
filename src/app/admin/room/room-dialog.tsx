import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { useCreateRoom, useUpdateRoom } from "@/queries/useRoomQuery";
import { RoomInput, RoomSchema } from "@/schemas/room.schema";
import { Room } from "@/types/object";
import { handleError } from "@/utils/error";

interface Props {
    open: boolean;
    onClose: () => void;
    room?: Room;
}

export function RoomDialog({ open, onClose, room }: Props) {
    const isEdit = !!room;
    const [searchCinema, setSearchCinema] = useState("");
    const debouncedSearch = useDebounce(searchCinema, 500);

    // States điều khiển Popover
    const [openCinema, setOpenCinema] = useState(false);
    const [openFormat, setOpenFormat] = useState(false);

    const form = useForm<RoomInput>({
        resolver: zodResolver(RoomSchema),
        defaultValues: { name: "", cinema: "", format: "" },
    });

    // Fetch dữ liệu với Search Debounce cho Cinema
    const { data: cinemasData, isPending: isCinemaPending } = useCinemaList({
        limit: 10,
        name: debouncedSearch
    });

    const { data: formatsData } = useFormatRoomList({ limit: 50 });

    const createMutation = useCreateRoom();
    const updateMutation = useUpdateRoom();

    useEffect(() => {
        if (open) {
            form.reset(room ? {
                name: room.name,
                cinema: typeof room.cinema === 'object' ? room.cinema._id : room.cinema,
                format: typeof room.format === 'object' ? room.format._id : room.format,
            } : { name: "", cinema: "", format: "" });
        }
    }, [open, room, form]);

    const onSubmit = async (values: RoomInput) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: room!._id, data: values });
                toast.success("Cập nhật thành công");
            } else {
                await createMutation.mutateAsync(values);
                toast.success("Thêm mới thành công");
            }
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-black text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Sửa phòng chiếu" : "Thêm phòng mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        {/* Tên phòng */}
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label-custom">Tên phòng</FormLabel>
                                <FormControl>
                                    <Input className="form-input-custom" placeholder="Ví dụ: P01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Chọn Rạp - Search API tương tự MovieDialog */}
                        <FormField control={form.control} name="cinema" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="form-label-custom">Thuộc Rạp</FormLabel>
                                <Popover open={openCinema} onOpenChange={setOpenCinema}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between form-input-custom font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? cinemasData?.data.find((c) => c._id === field.value)?.name || "Đang tải..."
                                                    : "Chọn rạp phim..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-neutral-900 border-neutral-800">
                                        <Command shouldFilter={false} className="bg-transparent text-white">
                                            <CommandInput
                                                placeholder="Tìm rạp theo tên..."
                                                className="text-white"
                                                value={searchCinema}
                                                onValueChange={setSearchCinema} // Cập nhật state search để trigger query
                                            />
                                            <CommandList>
                                                {isCinemaPending && (
                                                    <div className="flex items-center justify-center p-4">
                                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                                    </div>
                                                )}
                                                <CommandEmpty>Không tìm thấy rạp nào.</CommandEmpty>
                                                <CommandGroup>
                                                    {cinemasData?.data.map((cinema) => (
                                                        <CommandItem
                                                            key={cinema._id}
                                                            value={cinema._id}
                                                            onSelect={() => {
                                                                form.setValue("cinema", cinema._id);
                                                                setOpenCinema(false);
                                                            }}
                                                            className="text-white hover:bg-neutral-800 cursor-pointer"
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", cinema._id === field.value ? "opacity-100" : "opacity-0")} />
                                                            {cinema.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />

                        {/* Chọn Định dạng */}
                        <FormField control={form.control} name="format" render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="form-label-custom">Định dạng</FormLabel>
                                <Popover open={openFormat} onOpenChange={setOpenFormat}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "justify-between form-input-custom font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value
                                                    ? formatsData?.data.find((f) => f._id === field.value)?.name
                                                    : "Chọn định dạng..."}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-neutral-900 border-neutral-800">
                                        <Command className="bg-transparent text-white">
                                            <CommandInput placeholder="Tìm nhanh định dạng..." />
                                            <CommandList>
                                                <CommandEmpty>Không có định dạng phù hợp.</CommandEmpty>
                                                <CommandGroup>
                                                    {formatsData?.data.map((format) => (
                                                        <CommandItem
                                                            key={format._id}
                                                            value={format.name}
                                                            onSelect={() => {
                                                                form.setValue("format", format._id);
                                                                setOpenFormat(false);
                                                            }}
                                                            className="text-white hover:bg-neutral-800 cursor-pointer"
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", format._id === field.value ? "opacity-100" : "opacity-0")} />
                                                            {format.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button
                            type="submit"
                            className="btn-custom w-full h-11"
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {isEdit ? "Cập nhật phòng" : "Tạo phòng mới"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}