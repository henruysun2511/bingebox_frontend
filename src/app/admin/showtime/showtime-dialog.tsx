import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShowtimeInput, ShowtimeSchema } from "@/schemas/showtime.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { MovieStatusEnum } from "@/constants/enum";
import { cn } from "@/lib/utils";
import { useCinemaList } from "@/queries/useCinemaQuery";
import { useMovieList } from "@/queries/useMovieQuery";
import { useRoomList } from "@/queries/useRoomQuery";
import { useCreateShowtime, useUpdateShowtime } from "@/queries/useShowtimeQuery"; // Đảm bảo bạn có useUpdate
import { handleError } from "@/utils/error";

interface Props {
    open: boolean;
    onClose: () => void;
    showtime?: any; // Dữ liệu showtime khi nhấn "Sửa"
}

const toDatetimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export function ShowtimeDialog({ open, onClose, showtime }: Props) {
    const isEdit = !!showtime;
    const [selectedCinema, setSelectedCinema] = useState<string>("");

    const form = useForm<ShowtimeInput>({
        resolver: zodResolver(ShowtimeSchema),
        defaultValues: {
            movie: "",
            room: "",
            startTime: "",
        },
    });

    const { data: movies } = useMovieList({ 
        status: MovieStatusEnum.NOW_SHOWING,
        limit: 20 });
    const moviesData = movies?.data || [];

    //Theo dõi movieId người dùng đang chọn
    const selectedMovieId = form.watch("movie");

    //Tìm phim được chọn để lấy mảng subtitle của phim đó
    const selectedMovie = moviesData.find((m: any) => m._id === selectedMovieId);
    const movieSubtitles = selectedMovie?.subtitle || [];

    const { data: cinemas } = useCinemaList({ limit: 20 });
    const { data: rooms } = useRoomList(
        { cinemaId: selectedCinema }
    );

    const createMutation = useCreateShowtime();
    const updateMutation = useUpdateShowtime(); // Sử dụng mutation update

    useEffect(() => {
        // Khi movieId thay đổi, reset subtitle về rỗng
        form.setValue("subtitle", "");
    }, [selectedMovieId, form]);

    // Logic Reset Form khi đóng/mở hoặc chuyển chế độ Thêm/Sửa
    useEffect(() => {
        if (open) {
            if (showtime) {
                // Nếu là Edit, trích xuất ID từ Object và format lại ngày tháng
                const cinemaId = typeof showtime.room?.cinema === 'object'
                    ? showtime.room.cinema._id
                    : showtime.cinema;

                setSelectedCinema(cinemaId || "");

                form.reset({
                    movie: typeof showtime.movie === 'object' ? showtime.movie._id : showtime.movie,
                    room: typeof showtime.room === 'object' ? showtime.room._id : showtime.room,
                    subtitle: showtime.subtitle,
                    startTime: showtime.startTime
                        ? toDatetimeLocal(showtime.startTime)
                        : "",
                });
            } else {
                // Nếu là Add, reset về trống
                setSelectedCinema("");
                form.reset({ movie: "", room: "", startTime: "" });
            }
        }
    }, [open, showtime, form]);

    const onSubmit = async (values: ShowtimeInput) => {
        try {
            const payload = {
                ...values,
                startTime: new Date(values.startTime).toISOString(),
            };

            if (isEdit) {
                await updateMutation.mutateAsync({ id: showtime._id, data: payload });
                toast.success("Cập nhật lịch chiếu thành công");
            } else {
                await createMutation.mutateAsync(payload);
                toast.success("Thêm lịch chiếu thành công");
            }
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl bg-neutral-950 text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Cập nhật lịch chiếu" : "Thêm lịch chiếu mới"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Chọn Phim */}
                        <FormField control={form.control} name="movie" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label-custom">Phim chiếu</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="form-input-custom h-11">
                                            <SelectValue placeholder="Chọn phim..." />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                        {movies?.data.map((m) => (
                                            <SelectItem key={m._id} value={m._id}>{m.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="form-error-custom" />
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Loại phụ đề (Dựa trên phim)</FormLabel>
                                    <Select
                                        disabled={!selectedMovieId} // Chỉ cho chọn khi đã chọn phim
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="form-input-custom h-11 text-white">
                                                <SelectValue placeholder={selectedMovieId ? "Chọn phụ đề" : "Vui lòng chọn phim trước"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                            {movieSubtitles.length > 0 ? (
                                                movieSubtitles.map((sub: string) => (
                                                    <SelectItem key={sub} value={sub}>
                                                        {sub === "VIETSUB" ? "Vietsub" : sub === "LODING" ? "Lồng tiếng" : sub}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <div className="p-2 text-sm text-neutral-500">Phim này không có dữ liệu phụ đề</div>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        {/* Chọn Địa điểm: Rạp -> Phòng */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel className="form-label-custom">Rạp phim</FormLabel>
                                <Select
                                    value={selectedCinema}
                                    onValueChange={(val) => {
                                        setSelectedCinema(val);
                                        form.setValue("room", ""); // Reset phòng khi đổi rạp
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger className="form-input-custom h-11">
                                            <SelectValue placeholder="Chọn rạp" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                        {cinemas?.data.map((c) => (
                                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>

                            <FormField control={form.control} name="room" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">Phòng chiếu</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={!selectedCinema}
                                    >
                                        <FormControl>
                                            <SelectTrigger className={cn(
                                                "form-input-custom h-11",
                                                !selectedCinema && "opacity-50"
                                            )}>
                                                <SelectValue placeholder={selectedCinema ? "Chọn phòng" : "Chọn rạp trước"} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-neutral-900 border-neutral-800 text-white">
                                            {rooms?.data.map((r) => (
                                                <SelectItem key={r._id} value={r._id}>{r.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>

                        {/* Thời gian */}
                        <FormField control={form.control} name="startTime" render={({ field }) => (
                            <FormItem>
                                <FormLabel className="form-label-custom">Thời gian bắt đầu</FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        className="form-input-custom h-11 text-white"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className="form-error-custom" />
                            </FormItem>
                        )} />

                        <div className="pt-4 flex gap-3">
                            <Button
                                type="submit"
                                className="flex-1 btn-custom h-11 font-bold"
                                disabled={createMutation.isPending || updateMutation.isPending}
                            >
                                {createMutation.isPending || updateMutation.isPending
                                    ? "Đang xử lý..."
                                    : isEdit ? "Cập nhật lịch chiếu" : "Tạo lịch chiếu"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}