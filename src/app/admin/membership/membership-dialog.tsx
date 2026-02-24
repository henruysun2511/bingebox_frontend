"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateMembership, useUpdateMembership } from "@/queries/useMembershipQuery";
import { MembershipInput, MembershipSchema } from "@/schemas/membership.schema";
import { Membership } from "@/types/object";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Props {
    open: boolean;
    onClose: () => void;
    membership?: Membership;
}

export function MembershipDialog({ open, onClose, membership }: Props) {
    const isEdit = !!membership;
    const createMutation = useCreateMembership();
    const updateMutation = useUpdateMembership();

    const form = useForm<MembershipInput>({
        resolver: zodResolver(MembershipSchema) as any,
        defaultValues: { name: "", minSpending: 0, pointAccumulationRate: 0, discountRate: 0 },
    });

    useEffect(() => {
        if (membership && open) {
            form.reset({
                name: membership.name,
                minSpending: membership.minSpending,
                pointAccumulationRate: membership.pointAccumulationRate,
                discountRate: membership.discountRate,
            });
        } else if (!isEdit) {
            form.reset({ name: "", minSpending: 0, pointAccumulationRate: 0, discountRate: 0 });
        }
    }, [membership, open, form, isEdit]);

    const onSubmit = (data: MembershipInput) => {
        const action = isEdit 
            ? updateMutation.mutateAsync({ id: membership._id, data }) 
            : createMutation.mutateAsync(data);

        action
            .then(() => {
                toast.success(isEdit ? "Cập nhật thành công" : "Tạo mới thành công");
                onClose();
            })
            .catch((err) => toast.error(err.message));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900 text-white border-neutral-800">
                <DialogHeader><DialogTitle>{isEdit ? "Sửa hạng" : "Thêm hạng mới"}</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên hạng thành viên</FormLabel>
                                <FormControl><Input {...field} className="form-input-custom" /></FormControl>
                                <FormMessage className="form-error-custom" />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="minSpending" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chi tiêu tối thiểu (VNĐ)</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} className="form-input-custom" />
                                </FormControl>
                                <FormMessage className="form-error-custom" />
                            </FormItem>
                        )} />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="pointAccumulationRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tỷ lệ tích điểm (0 - 1)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="discountRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tỷ lệ giảm giá (0 - 1)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} onChange={e => field.onChange(e.target.valueAsNumber || 0)} className="form-input-custom" />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )} />
                        </div>
                        <Button type="submit" className="w-full btn-custom" disabled={createMutation.isPending || updateMutation.isPending}>
                            Xác nhận
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}