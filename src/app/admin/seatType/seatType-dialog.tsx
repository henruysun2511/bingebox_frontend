import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateSeatType, useUpdateSeatType } from "@/queries/useSeatTypeQuery";
import { SeatTypeInput, SeatTypeSchema } from "@/schemas/seatType.schema";
import { SeatType } from "@/types/object";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    seatType?: SeatType;
}

export function SeatTypeDialog({ open, onClose, seatType }: Props) {
    const isEdit = !!seatType;
    const form = useForm<SeatTypeInput>({
        resolver: zodResolver(SeatTypeSchema),
        defaultValues: { name: "", color: "#000000" },
    });

    const createMutation = useCreateSeatType();
    const updateMutation = useUpdateSeatType();

    useEffect(() => {
        if (open) {
            form.reset(seatType ? {
                name: seatType.name,
                color: seatType.color,
            } : { name: "", color: "#000000" });
        }
    }, [open, seatType, form]);

    const onSubmit = async (values: SeatTypeInput) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: seatType!._id, data: values });
                toast.success("Cập nhật loại ghế thành công");
            } else {
                await createMutation.mutateAsync(values);
                toast.success("Thêm loại ghế mới thành công");
            }
            onClose();
        } catch (error) { handleError(error); }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-[#0a0a0a] text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Sửa loại ghế" : "Thêm loại ghế mới"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên loại ghế</FormLabel>
                                <FormControl><Input className="form-input-custom" placeholder="Ví dụ: Ghế VIP" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <FormField control={form.control} name="color" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Màu sắc hiển thị</FormLabel>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input type="color" className="w-12 h-10 p-1 bg-neutral-900 border-neutral-800" {...field} />
                                    </FormControl>
                                    <FormControl>
                                        <Input className="form-input-custom flex-1" placeholder="#FFFFFF" {...field} />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <Button type="submit" className="btn-custom w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                            {isEdit ? "Lưu thay đổi" : "Tạo ngay"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}