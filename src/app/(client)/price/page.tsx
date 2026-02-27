"use client";

import { DataPagination } from "@/components/admin/pagination/data-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DayOfWeekEnum } from "@/constants/enum";
// 1. Import các hook fetch dữ liệu
import { useAgeTypeList } from "@/queries/useAgeTypeQuery";
import { useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { useTicketPriceList } from "@/queries/useTicketPrice";
import { useTimeSlotList } from "@/queries/useTimeSlotQuery";
import { TicketPrice } from "@/types/object";
import { useState } from "react";

export default function ClientTicketPricePage() {
    const [page, setPage] = useState(1);
    const limit = 25;
    const [params, setParams] = useState<any>({ dayOfWeek: DayOfWeekEnum.MONDAY });

    const { data, isPending } = useTicketPriceList({ ...params, page, limit });
    const ticketPrices = data?.data || [];
    const pagination = data?.pagination;

    // Fetch dữ liệu cho các select option
    const { data: formats } = useFormatRoomList({});
    const { data: seatTypes } = useSeatTypeList();
    const { data: ageTypes } = useAgeTypeList({});
    const { data: timeSlots } = useTimeSlotList();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Helper để cập nhật params
    const handleChangeParams = (key: string, value: string) => {
        setParams((prev: any) => ({
            ...prev,
            [key]: value === "all" ? undefined : value,
        }));
        setPage(1);
    };

    return (
        <div className="relative min-h-screen  text-white mt-10">

            {/* Background overlay */}
            <div className="absolute inset-0 bg-[url('/cinema-bg.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />

            <div className="relative container mx-auto py-14 px-4">

                {/* HEADER */}
                <div className="text-center mb-14">
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
                        Bảng Giá Vé
                    </h1>
                    <p className="text-neutral-400 mt-3 text-lg">
                        Xem chi tiết giá vé theo khung giờ, loại ghế và đối tượng khách hàng
                    </p>
                </div>

                {/* FILTER CARD */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl mb-10 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-white">
                            Bộ lọc tìm kiếm
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            {[
                                {
                                    value: params.dayOfWeek || "all",
                                    onChange: (v: string) => handleChangeParams("dayOfWeek", v),
                                    placeholder: "Chọn thứ",
                                    items: Object.values(DayOfWeekEnum).map((day) => ({
                                        value: day,
                                        label: day,
                                    })),
                                },
                                {
                                    value: params.timeSlot || "all",
                                    onChange: (v: string) => handleChangeParams("timeSlot", v),
                                    placeholder: "Chọn khung giờ",
                                    items: timeSlots?.data.map((t: any) => ({
                                        value: t._id,
                                        label: `${t.name} (${t.startTime} - ${t.endTime})`,
                                    })),
                                },
                                {
                                    value: params.ageType || "all",
                                    onChange: (v: string) => handleChangeParams("ageType", v),
                                    placeholder: "Chọn đối tượng",
                                    items: ageTypes?.data.map((a: any) => ({
                                        value: a._id,
                                        label: a.name,
                                    })),
                                },
                                {
                                    value: params.formatRoom || "all",
                                    onChange: (v: string) => handleChangeParams("formatRoom", v),
                                    placeholder: "Chọn định dạng",
                                    items: formats?.data.map((f: any) => ({
                                        value: f._id,
                                        label: f.name,
                                    })),
                                },
                                {
                                    value: params.seatType || "all",
                                    onChange: (v: string) => handleChangeParams("seatType", v),
                                    placeholder: "Chọn loại ghế",
                                    items: seatTypes?.data.map((s: any) => ({
                                        value: s._id,
                                        label: s.name,
                                    })),
                                },
                            ].map((filter, i) => (
                                <Select
                                    key={i}
                                    value={filter.value}
                                    onValueChange={filter.onChange}
                                >
                                    <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white backdrop-blur-lg rounded-xl hover:bg-white/10 transition">
                                        <SelectValue placeholder={filter.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#1a1a2e] border-white/10 text-white rounded-xl">
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        {filter.items?.map((item: any) => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* TABLE CARD */}
                <Card className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl">
                    <CardContent className="p-0">
                        {isPending ? (
                            <div className="p-6 space-y-3">
                                <Skeleton className="h-12 w-full bg-white/10" />
                                <Skeleton className="h-12 w-full bg-white/10" />
                                <Skeleton className="h-12 w-full bg-white/10" />
                            </div>
                        ) : ticketPrices.length > 0 ? (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/10 bg-white/5">
                                            <TableHead>Ngày</TableHead>
                                            <TableHead>Khung giờ</TableHead>
                                            <TableHead>Định dạng</TableHead>
                                            <TableHead>Loại ghế</TableHead>
                                            <TableHead>Đối tượng</TableHead>
                                            <TableHead className="text-right">Giá vé</TableHead>
                                        </TableRow>
                                    </TableHeader>

                                    <TableBody>
                                        {ticketPrices.map((item: TicketPrice) => (
                                            <TableRow
                                                key={item._id}
                                                className="border-white/10 hover:bg-white/10 transition duration-200"
                                            >
                                                <TableCell>
                                                    <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full text-xs font-medium">
                                                        {item.dayOfWeek}
                                                    </span>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="font-semibold">
                                                        {item.timeSlot.name}
                                                    </div>
                                                    <div className="text-xs text-neutral-400">
                                                        {item.timeSlot.startTime} - {item.timeSlot.endTime}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <span className="bg-white/10 px-3 py-1 rounded-full text-xs">
                                                        {item.formatRoom.name}
                                                    </span>
                                                </TableCell>

                                                <TableCell>{item.seatType.name}</TableCell>
                                                <TableCell>{item.ageType.name}</TableCell>

                                                <TableCell className="text-right">
                                                    <span className="text-xl font-bold text-golden">
                                                        {formatCurrency(item.finalPrice)}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className="p-6 border-t border-white/10">
                                    <DataPagination
                                        page={pagination?.page ?? 1}
                                        totalPages={pagination?.totalPages ?? 1}
                                        onPageChange={setPage}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-14 text-neutral-400">
                                Không có dữ liệu giá vé phù hợp
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}