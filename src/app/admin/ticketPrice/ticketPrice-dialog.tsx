"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayOfWeekEnum } from "@/constants/enum";
import { useAgeTypeList } from "@/queries/useAgeTypeQuery";
import { useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { useCreateTicketPrice, useUpdateTicketPrice } from "@/queries/useTicketPrice";
import { useTimeSlotList } from "@/queries/useTimeSlotQuery";
import { TicketPriceInput, TicketPriceSchema } from "@/schemas/ticketPrice.schema";
import { TicketPrice } from "@/types/object";
import { handleError } from "@/utils/error";
import { removeEmptyFields } from "@/utils/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    data?: TicketPrice;
}

export function TicketPriceDialog({ open, onClose, data }: Props) {
    const isEdit = !!data;
    const createMu = useCreateTicketPrice();
    const updateMu = useUpdateTicketPrice();

    // Gọi các API để đổ vào Select
    const { data: formats } = useFormatRoomList({});
    const { data: seatTypes } = useSeatTypeList();
    const { data: ageTypes } = useAgeTypeList({});
    const { data: timeSlots } = useTimeSlotList();

    const form = useForm<TicketPriceInput>({
        resolver: zodResolver(TicketPriceSchema) as any,
        defaultValues: {
            timeSlot: "",
            ageType: "",
            formatRoom: "",
            seatType: "",
            dayOfWeek: DayOfWeekEnum.MONDAY,
            finalPrice: 0,
        },
    });

    useEffect(() => {
        if (data) {
            form.reset({
                timeSlot: data.timeSlot._id,
                ageType: data.ageType._id,
                formatRoom: data.formatRoom._id,
                seatType: data.seatType._id,
                dayOfWeek: data.dayOfWeek,
                finalPrice: data.finalPrice,
            });
        } else {
            form.reset({
                finalPrice: 0,
                dayOfWeek: DayOfWeekEnum.MONDAY,
                timeSlot: "",
                ageType: "",
                formatRoom: "",
                seatType: ""
            });
        }
    }, [data, open, form]);

    const onSubmit = async (values: TicketPriceInput) => {
        try {
            const cleanValues = removeEmptyFields(values) as TicketPriceInput;

            if (isEdit) {
                await updateMu.mutateAsync({
                    id: data!._id,
                    data: cleanValues
                });
                toast.success("Cập nhật cấu hình giá thành công");
            } else {
                await createMu.mutateAsync(cleanValues);
                toast.success("Thêm cấu hình giá mới thành công");
            }
            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 border-neutral-800 text-white !max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Cập nhật cấu hình giá" : "Thêm cấu hình giá mới"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">

                        <FormField control={form.control} name="dayOfWeek" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ngày trong tuần</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="form-input-custom"><SelectValue /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {Object.values(DayOfWeekEnum).map(d => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="form-error-custom" />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="timeSlot" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Khung giờ</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="form-input-custom"><SelectValue placeholder="Chọn khung giờ" /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {timeSlots?.data.map((t: any) => (
                                            <SelectItem key={t._id} value={t._id}>{t.name} ({t.startTime} - {t.endTime})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="form-error-custom" />
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="ageType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Đối tượng / Độ tuổi</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="form-input-custom"><SelectValue placeholder="Chọn loại đối tượng" /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {ageTypes?.data.map((a: any) => (
                                            <SelectItem key={a._id} value={a._id}>{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="form-error-custom"/>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="formatRoom" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Định dạng phòng</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="form-input-custom"><SelectValue placeholder="Chọn định dạng" /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {formats?.data.map((f: any) => (
                                            <SelectItem key={f._id} value={f._id}>{f.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="form-error-custom"/>
                            </FormItem>
                        )} />

                        <FormField control={form.control} name="seatType" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Loại ghế</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger className="form-input-custom"><SelectValue placeholder="Chọn loại ghế" /></SelectTrigger></FormControl>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {seatTypes?.data.map((s: any) => (
                                            <SelectItem key={s._id} value={s._id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage className="form-error-custom"/>
                            </FormItem>
                        )} />

                        {/* 6. Giá cuối cùng */}
                        <FormField control={form.control} name="finalPrice" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Giá vé niêm yết (VNĐ)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        className="form-input-custom"
                                        placeholder="Ví dụ: 85000"
                                    />
                                </FormControl>
                                <FormMessage className="form-error-custom"/>
                            </FormItem>
                        )} />

                        <Button
                            type="submit"
                            className="col-span-2 btn-custom h-12 mt-4"
                            disabled={createMu.isPending || updateMu.isPending}
                        >
                            {isEdit ? "Cập nhật cấu hình" : "Xác nhận tạo mới"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}