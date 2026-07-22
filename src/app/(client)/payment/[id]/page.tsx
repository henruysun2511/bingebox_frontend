"use client";

import LoadingScreen from "@/components/common/loading/loading-screen";
import { useCreatePayment, useFailPayment, usePaymentStatus } from "@/queries/usePaymentQuery";
import { useBookingDetail } from "@/queries/useBookingQuery";
import { BookingStatusEnum, PaymentStatusEnum } from "@/constants/enum";
import { differenceInSeconds, format } from "date-fns";
import {
    Calendar,
    Clock,
    Copy,
    Landmark,
    MapPin,
    Smartphone,
    Ticket,
    Utensils,
    XCircle
} from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

const BANK_ACC = "0362832880";
const BANK_NAME = "Vietinbank";
const BANK_HOLDER = "Dang Nhat Huy";

export default function PaymentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const bookingId = params.id as string;

    const { data: resData, isLoading } = useBookingDetail(bookingId);
    const bookingData = resData?.data;
    const booking = bookingData?.booking;
    const tickets = bookingData?.tickets || [];

    const { mutate: createPayment } = useCreatePayment();
    const { mutate: fail, isPending: isFailing } = useFailPayment();

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [payment, setPayment] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const createdRef = useRef(false);

    const { data: statusData } = usePaymentStatus(bookingId, 5000);
    const paymentStatus = statusData?.paymentStatus;
    const bookingStatus = statusData?.bookingStatus;

    useEffect(() => {
        if (paymentStatus === PaymentStatusEnum.SUCCESS || bookingStatus === BookingStatusEnum.SUCCESS) {
            toast.success("Thanh toán thành công!", {
                description: "Đang chuyển hướng đến vé của bạn..."
            });
            const firstTicketId = tickets?.[0]?._id;
            setTimeout(() => router.push(firstTicketId ? `/ticket/${firstTicketId}` : "/profile"), 2000);
        }
    }, [paymentStatus, bookingStatus, router, tickets]);

    useEffect(() => {
        if (booking?._id && !createdRef.current) {
            createdRef.current = true;
            createPayment(booking._id, {
                onSuccess: (res: any) => {
                    setPayment(res?.data?.data || res?.data || res);
                },
                onError: () => {
                    createdRef.current = false;
                    toast.error("Không thể tạo giao dịch", {
                        description: "Vui lòng thử lại",
                        action: { label: "Thử lại", onClick: () => { createdRef.current = false; } }
                    });
                }
            });
        }
    }, [booking?._id, createPayment]);

    useEffect(() => {
        if (booking?.expiresAt) {
            const timer = setInterval(() => {
                const now = new Date();
                const expire = new Date(booking.expiresAt);
                const diff = differenceInSeconds(expire, now);

                if (diff <= 0) {
                    clearInterval(timer);
                    setTimeLeft(0);
                    toast.error("Giao dịch đã hết hạn!", {
                        description: "Hệ thống sẽ đưa bạn quay lại trang chủ."
                    });
                    setTimeout(() => router.push("/"), 2000);
                } else {
                    setTimeLeft(diff);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [booking?.expiresAt, router]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const handleCopy = async () => {
        if (payment?.referenceCode) {
            await navigator.clipboard.writeText(payment.referenceCode);
            setCopied(true);
            toast.success("Đã sao chép nội dung chuyển khoản");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCancel = () => {
        fail(bookingId, {
            onSuccess: () => {
                toast.warning("Đã hủy giao dịch");
                router.push("/");
            }
        });
    };

    const qrUrl = useMemo(() =>
        payment?.referenceCode
            ? `https://qr.sepay.vn/img?acc=${BANK_ACC}&bank=${BANK_NAME}&amount=${booking?.finalAmount || 0}&des=${payment.referenceCode}`
            : "",
        [payment?.referenceCode, booking?.finalAmount]
    );

    if (isLoading) return <LoadingScreen />;

    if (!booking) notFound();

    return (
        <div className="container mx-auto py-10 mt-20 max-w-5xl">
            {/* COUNTDOWN */}
            <div className="bg-orange-500/10 border border-orange-500/50 rounded-xl p-4 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3 text-orange-500">
                    <Clock className="animate-pulse" />
                    <span className="font-medium">Thời gian thanh toán còn lại:</span>
                </div>
                <span className="text-3xl font-mono font-bold text-orange-500">
                    {formatTime(timeLeft)}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CỘT TRÁI */}
                <div className="lg:col-span-2 space-y-6">
                    {/* QR + BANK INFO */}
                    {payment && (
                        <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl">
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                <Landmark className="text-green-500" /> Quét mã QR để thanh toán
                            </h2>

                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="bg-white rounded-2xl p-3 shadow-lg">
                                    <img
                                        src={qrUrl}
                                        alt="QR thanh toán"
                                        className="w-52 h-52"
                                    />
                                </div>

                                <div className="flex-1 space-y-4 text-sm">
                                    <div className="flex items-center gap-2 text-green-400 font-medium">
                                        <Smartphone size={18} />
                                        <span>Mở app ngân hàng quét mã QR bên cạnh</span>
                                    </div>

                                    <div className="bg-neutral-900/50 rounded-xl p-4 space-y-3 border border-neutral-800">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Ngân hàng</span>
                                            <span className="text-white font-medium">{BANK_NAME}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Số tài khoản</span>
                                            <span className="text-white font-medium">{BANK_ACC}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-400">Chủ tài khoản</span>
                                            <span className="text-white font-medium">{BANK_HOLDER}</span>
                                        </div>
                                        <div className="border-t border-neutral-800 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-neutral-400">Nội dung</span>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-green-400 font-bold text-xs">{payment.referenceCode}</span>
                                                    <button onClick={handleCopy} className="p-1 hover:bg-neutral-800 rounded-lg transition-colors">
                                                        <Copy size={14} className={copied ? "text-green-500" : "text-neutral-500"} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t border-neutral-800 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-neutral-400">Số tiền</span>
                                                <span className="text-xl font-bold text-blue">{booking.finalAmount.toLocaleString()}đ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-neutral-500 leading-relaxed">
                                        <span className="text-yellow-500">Không đóng trang này.</span> Sau khi chuyển khoản, hệ thống sẽ tự động xác nhận trong 1-2 phút.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* DANH SÁCH VÉ */}
                    <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Ticket className="text-blue" /> Chi tiết vé của bạn
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {tickets.map((ticket: any) => (
                                <div key={ticket._id} className="bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex items-center gap-4">
                                    <img src={ticket.qrCode} alt="QR" className="w-24 h-24 bg-white p-1 rounded-lg" />
                                    <div>
                                        <p className="text-white font-bold text-lg">Ghế: {ticket.seat?.code || "N/A"}</p>
                                        <p className="text-sm text-neutral-400">Loại: {ticket.seat?.seatType?.name || "N/A"}</p>
                                        <p className="text-blue font-semibold mt-1">{ticket.price.toLocaleString()}đ</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ĐỒ ĂN */}
                    <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Utensils className="text-orange-500" /> Đồ ăn kèm
                        </h2>
                        {booking.foods.length > 0 ? (
                            <div className="space-y-4">
                                {booking.foods.map((item: any) => (
                                    <div key={item._id} className="flex justify-between items-center text-neutral-300">
                                        <span>{item.foodId.name} <b className="text-white">x{item.quantity}</b></span>
                                        <span className="font-medium">{(item.priceAtBooking * item.quantity).toLocaleString()}đ</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-neutral-500 italic">Không có đồ ăn đi kèm</p>
                        )}
                    </div>
                </div>

                {/* CỘT PHẢI: TÓM TẮT */}
                <div className="space-y-6">
                    <div className="bg-card border border-neutral-900 rounded-2xl p-6 shadow-xl sticky top-28">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-white uppercase mb-2">{booking.showtime.movie.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-neutral-400">
                                <span className="bg-orange-600 text-white px-2 py-0.5 rounded text-xs font-bold">
                                    {booking.showtime.movie.agePermission}
                                </span>
                                <span>• {booking.showtime.room.format?.name || "Standard"}</span>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-b border-neutral-800 py-6 my-6 border-dashed">
                            <div className="flex items-start gap-3">
                                <MapPin size={18} className="text-neutral-500 mt-1" />
                                <div>
                                    <p className="text-white font-medium">{booking.showtime.room.name}</p>
                                    <p className="text-xs text-neutral-400">{booking.showtime.room.format?.name || ""}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar size={18} className="text-neutral-500 mt-1" />
                                <div>
                                    <p className="text-white font-medium">
                                        {format(new Date(booking.showtime.startTime), "HH:mm")} - {format(new Date(booking.showtime.startTime), "dd/MM/yyyy")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-neutral-400">
                                <span>Tạm tính</span>
                                <span>{booking.totalAmount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Giảm giá</span>
                                <span>-{booking.discountAmount.toLocaleString()}đ</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Điểm sử dụng</span>
                                <span>-{booking.pointsUsed} điểm</span>
                            </div>
                            <div className="flex justify-between text-neutral-400">
                                <span>Điểm thưởng</span>
                                <span>+{booking.pointsEarned} điểm</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-neutral-800">
                                <span className="text-lg font-bold text-white">Tổng tiền</span>
                                <span className="text-2xl font-bold text-blue tracking-tighter">
                                    {booking.finalAmount.toLocaleString()}đ
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCancel}
                            disabled={isFailing || timeLeft === 0}
                            className="w-full bg-transparent hover:bg-red-500/10 border border-neutral-800 hover:border-red-500/50 text-neutral-400 hover:text-red-500 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                        >
                            <XCircle size={18} />
                            {isFailing ? "ĐANG HỦY..." : "HỦY GIAO DỊCH"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
