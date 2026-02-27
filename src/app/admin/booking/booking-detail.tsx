import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useBookingDetail } from "@/queries/useBookingQuery";

interface BookingDetailDialogProps {
    open: boolean;
    bookingId: string | null; // Truyền ID thay vì object booking
    onClose: () => void;
}

export const BookingDetailDialog = ({
  open,
  bookingId,
  onClose,
}: BookingDetailDialogProps) => {
  const { data: bookingDetailRes, isPending } =
    useBookingDetail(bookingId || undefined);

  const bookingDetail = bookingDetailRes?.data;

  if (!bookingId || isPending || !bookingDetail) return null;

  const { booking, tickets } = bookingDetail;

  const showtime = booking.showtime;
  const movie = showtime.movie;
  const room = showtime.room;

  const start = new Date(showtime.startTime);
  const end = new Date(showtime.endTime);

  const formatCurrency = (num: number) =>
    num.toLocaleString("vi-VN") + "đ";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] p-0 bg-white overflow-y-auto max-h-[90vh]">
        <div className="p-6 text-black text-sm leading-relaxed space-y-3">

          {/* HEADER */}
          <h2 className="text-center text-2xl font-bold">
            HỆ THỐNG RẠP CHIẾU PHIM BINGEBOX
          </h2>

          <p>Booking ID: {booking._id}</p>
          <p>Trạng thái: {booking.bookingStatus}</p>
          <p>
            Thời gian giao dịch:{" "}
            {new Date(booking.createdAt).toLocaleString("vi-VN")}
          </p>

          <hr className="border-dashed border-gray-400 my-3" />

          {/* USER */}
          <p>Khách hàng: {booking.userId.fullName}</p>
          <p>Email: {booking.userId.email}</p>
          <p>Username: {booking.userId.username}</p>

          <hr className="border-dashed border-gray-400 my-3" />

          {/* MOVIE */}
          <h3 className="text-lg font-bold">{movie.name}</h3>
          <p>Thời lượng: {movie.duration} phút</p>
          <p>Giới hạn tuổi: {movie.agePermission}</p>
          <p>Phụ đề: {showtime.subtitle}</p>

          <hr className="border-dashed border-gray-400 my-3" />

          {/* SHOWTIME */}
          <p>
            Suất chiếu:{" "}
            {start.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {end.toLocaleTimeString("vi-VN", {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            ({start.toLocaleDateString("vi-VN")})
          </p>

          <p>Phòng: {room.name}</p>
          <p>Định dạng: {room.format.name}</p>

          <hr className="border-dashed border-gray-400 my-3" />

          {/* TICKETS – mỗi vé 1 dòng */}
          <h4 className="font-bold">Danh sách vé:</h4>

          {tickets.map((ticket: any) => (
            <div
              key={ticket._id}
              className="border border-gray-300 rounded-md p-3 space-y-1"
            >
              <div className="flex justify-between">
                <p>Ghế: {ticket.seat.code}</p>
                <p>{formatCurrency(ticket.price)}</p>
              </div>

              <p>Loại ghế: {ticket.seat.seatType.name}</p>
              <p>Màu ghế: {ticket.seat.seatType.color}</p>
              <p>Trạng thái vé: {ticket.status}</p>
              <p>Ticket ID: {ticket._id}</p>

              {ticket.qrCode && (
                <img
                  src={ticket.qrCode}
                  alt="QR"
                  className="w-24 h-24 object-contain mt-2"
                />
              )}
            </div>
          ))}

          <hr className="border-dashed border-gray-400 my-3" />

          {/* FOODS */}
          {booking.foods.length > 0 && (
            <>
              <h4 className="font-bold">Combo / Thức ăn:</h4>

              {booking.foods.map((food: any) => (
                <div
                  key={food._id}
                  className="flex justify-between"
                >
                  <p>
                    {food.foodId.name} x{food.quantity}
                  </p>
                  <p>
                    {formatCurrency(
                      food.priceAtBooking * food.quantity
                    )}
                  </p>
                </div>
              ))}

              <hr className="border-dashed border-gray-400 my-3" />
            </>
          )}

          {/* POINTS & VOUCHER */}
          <p>Voucher: {booking.voucher || "Không có"}</p>
          <p>Điểm sử dụng: {booking.pointsUsed}</p>
          <p>Điểm nhận được: {booking.pointsEarned}</p>

          <hr className="border-dashed border-gray-400 my-3" />

          {/* SUMMARY */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <p>Tổng tiền:</p>
              <p>{formatCurrency(booking.totalAmount)}</p>
            </div>

            {booking.discountAmount > 0 && (
              <div className="flex justify-between text-red-600">
                <p>Giảm giá:</p>
                <p>-{formatCurrency(booking.discountAmount)}</p>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold">
              <p>Thanh toán:</p>
              <p>{formatCurrency(booking.finalAmount)}</p>
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};