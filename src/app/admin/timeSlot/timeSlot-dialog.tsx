import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateTimeSlot, useUpdateTimeSlot } from "@/queries/useTimeSlotQuery";
import { TimeSlotInput, TimeSlotSchema } from "@/schemas/timeSlot.schema";
import { handleError } from "@/utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


export function TimeSlotDialog({ open, onClose, data }: { open: boolean; onClose: () => void; data?: any }) {
    const isEdit = !!data;
    const form = useForm({
        resolver: zodResolver(TimeSlotSchema),
        defaultValues: { name: "", startTime: "", endTime: "" },
    });

    const createMutation = useCreateTimeSlot();
    const updateMutation = useUpdateTimeSlot();

    useEffect(() => {
        if (open) form.reset(data || { name: "", startTime: "", endTime: "" });
    }, [open, data, form]);

    const onSubmit = async (values: TimeSlotInput) => {
        try {
            if (isEdit) {
                await updateMutation.mutateAsync({ id: data._id, data: values });
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
            <DialogContent className="bg-black text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle>{isEdit ? "Sửa khung giờ" : "Thêm khung giờ"}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên khung giờ</FormLabel>
                                <FormControl><Input className="form-input-custom" placeholder="VD: Khung giờ sáng" {...field} /></FormControl>
                                <FormMessage className="form-error-custom"/>
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="startTime" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giờ bắt đầu</FormLabel>
                                    <FormControl><Input className="form-input-custom" placeholder="08:00" {...field} /></FormControl>
                                    <FormMessage className="form-error-custom"/>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="endTime" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Giờ kết thúc</FormLabel>
                                    <FormControl><Input className="form-input-custom" placeholder="12:00" {...field} /></FormControl>
                                    <FormMessage className="form-error-custom"/>
                                </FormItem>
                            )} />
                        </div>
                        <Button type="submit" className="btn-custom w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                            Lưu thông tin
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}