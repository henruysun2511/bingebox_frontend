"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Textarea } from "@/components/ui/textarea"
import { useCreateVoucher, useUpdateVoucher } from "@/queries/useVoucherQuery"
import { VoucherInput, VoucherSchema } from "@/schemas/voucher.schema"
import { Voucher } from "@/types/object"
import { handleError } from "@/utils/error"
import { removeEmptyFields } from "@/utils/form"

interface Props {
    open: boolean
    onClose: () => void
    voucher?: Voucher
}

export function VoucherDialog({ open, onClose, voucher }: Props) {
    const isEdit = !!voucher

    const form = useForm<VoucherInput>({
        resolver: zodResolver(VoucherSchema) as any,
        defaultValues: {
            name: "",
            code: "",
            description: "",
            startTime: "",
            endTime: "",
            minOrderValue: 0,
            maxDiscountAmount: 0,
            maxUsage: 1,
        },
    })

    const createVoucher = useCreateVoucher()
    const updateVoucher = useUpdateVoucher()

    useEffect(() => {
        if (open) {
            if (voucher) {
                form.reset({
                    name: voucher.name,
                    code: voucher.code,
                    description: voucher.description ?? "",
                    startTime: voucher.startTime.split("T")[0],
                    endTime: voucher.endTime.split("T")[0],
                    minOrderValue: voucher.minOrderValue,
                    maxDiscountAmount: voucher.maxDiscountAmount,
                    maxUsage: voucher.maxUsage,
                })
            } else {
                form.reset()
            }
        }
    }, [open, voucher, form])

    const onSubmit = async (values: VoucherInput) => {
        try {
            const cleanValues = removeEmptyFields(values) as VoucherInput;

            if (isEdit) {
                await updateVoucher.mutateAsync({
                    id: voucher!._id,
                    data: cleanValues,
                })
                toast.success("Cập nhật voucher thành công")
            } else {
                await createVoucher.mutateAsync(cleanValues)
                toast.success("Thêm voucher thành công")
            }

            onClose()
        } catch (error: any) {
            handleError(error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-black text-white border-neutral-800">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEdit ? "Sửa Voucher" : "Thêm Voucher"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-5"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">
                                        Tên voucher
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="form-input-custom"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label-custom">
                                        Code
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="form-input-custom"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-custom" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="startTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">
                                            Ngày bắt đầu
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="form-input-custom"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="endTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">
                                            Ngày kết thúc
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                className="form-input-custom"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="form-error-custom" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="minOrderValue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">
                                            Đơn tối thiểu
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="form-input-custom"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxDiscountAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">
                                            Giảm tối đa
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="form-input-custom"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxUsage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label-custom">
                                            Số lượt
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                className="form-input-custom"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập mô tả voucher..."
                                            className="bg-neutral-900 border-neutral-800"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            className="btn-custom w-full"
                            disabled={
                                createVoucher.isPending ||
                                updateVoucher.isPending
                            }
                        >
                            {isEdit ? "Lưu thay đổi" : "Tạo Voucher"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}