"use client";

import BookingDetailSkeleton from "@/components/common/skeleton/booking-skeleton";
import { useShowtimeDetail } from "@/queries/useShowtimeQuery";
import { useParams } from "next/navigation";
import { useState } from "react";
import FoodListClient from "../food-list";
import OrderSummary from "../order-summary";
import SeatListClient from "../seat-list";
import UserPoint from "../user-point";
import VoucherListClient from "../voucher-list";

export default function BookingDetailPage() {
    const params = useParams();
    const showtimeId = params.id as string;
    const [step, setStep] = useState(1); // 1: Ghế, 2: Đồ ăn, 3: Voucher
    const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
    const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<any>(null);
    const [pointsUsed, setPointsUsed] = useState(0);

    // Lấy dữ liệu chi tiết suất chiếu
    const { data: showtimeResData, isLoading } = useShowtimeDetail(showtimeId);
    const showtime = showtimeResData?.data;
    console.log(showtime)

    if (isLoading) return <BookingDetailSkeleton />;

    const totalSeatsPrice = selectedSeats.reduce((sum, seat) => sum + (seat.price || seat.seatType?.price  || 0), 0);
    const totalFoodsPrice = selectedFoods.reduce((sum, food) => sum + food.price * food.quantity, 0);
    const subTotal = totalSeatsPrice + totalFoodsPrice;
    const discount = selectedVoucher ? Math.min(selectedVoucher.maxDiscountAmount, subTotal) : 0;
    const finalAmountBeforePoints = subTotal - discount;


    return (
        <div className="container mx-auto py-10 px-4 mt-20">
            <div className="flex flex-col lg:flex-row gap-8">

                {/* BÊN TRÁI: DANH SÁCH GHẾ, ĐỒ ĂN  */}
                <div className="flex-1 !min-h-[500px] rounded-xl flex items-center justify-center text-neutral-500">
                    {step === 1 && (
                        <SeatListClient
                            showtimeId={showtimeId}
                            selectedSeats={selectedSeats}
                            setSelectedSeats={setSelectedSeats}
                        />
                    )}
                    {step === 2 && (
                        <FoodListClient
                            selectedFoods={selectedFoods}
                            setSelectedFoods={setSelectedFoods}
                        />
                    )}
                    {step === 3 && (
                        <div className="w-full space-y-6">
                            <UserPoint
                                pointsUsed={pointsUsed}
                                setPointsUsed={setPointsUsed}
                                finalAmountBeforePoints={finalAmountBeforePoints}
                            />
                            <VoucherListClient
                                selectedVoucher={selectedVoucher}
                                setSelectedVoucher={setSelectedVoucher}
                            />
                        </div>
                    )}

                </div>

                {/* BÊN PHẢI: TÓM TẮT ĐƠN HÀNG */}
                <OrderSummary
                    showtime={showtime}
                    step={step}
                    setStep={setStep}
                    selectedSeats={selectedSeats}
                    selectedFoods={selectedFoods}
                    selectedVoucher={selectedVoucher}
                    pointsUsed={pointsUsed}
                />
            </div>
        </div>
    );
}

