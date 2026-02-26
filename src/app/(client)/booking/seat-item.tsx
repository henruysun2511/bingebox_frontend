"use client";

interface Props {
  seat: any;
  isSelected: boolean;
  onClick: () => void;
}

export default function SeatItemClient({ seat, isSelected, onClick }: Props) {
  // 1. Xử lý ô trống (Layout)
  if (seat.code === "TRỐNG" || seat.isBlocked) {
    return <div className="w-10 h-10" />; // Trả về ô trống không có border/màu
  }

  // 2. Xác định trạng thái ghế
  const isSold = seat.status === "SOLD";
  const isHold = seat.status === "HOLD";
  const isAvailable = seat.status === "AVAILABLE";

  // 3. Logic màu sắc
  let bgColor = seat.seatType?.color || "#3f3f46"; // Mặc định từ loại ghế
  
  if (isSold) bgColor = "#171717"; // Màu xám tối cho ghế đã bán
  if (isHold) bgColor = "#f59e0b"; // Màu vàng cho ghế đang giữ (Hold)
  if (isSelected) bgColor = "#0066FF"; // Màu xanh dương khi người dùng chọn

  // 4. Logic vô hiệu hóa click
  const isDisabled = isSold || isHold;

  return (
    <div
      onClick={!isDisabled ? onClick : undefined}
      style={{ backgroundColor: bgColor }}
      className={`
        w-10 h-10 text-[10px] font-bold flex items-center justify-center transition-all text-white
        ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-105 shadow-lg"}
        ${isSelected ? "ring-2 ring-white z-10 scale-110" : ""}
        ${seat.isCoupleSeat 
          ? "rounded-none first:rounded-l-lg last:rounded-r-lg border-x border-white/10 w-20" 
          : "rounded-md"}
        ${isSold ? "grayscale" : ""}
      `}
    >
      <div className="flex flex-col items-center">
        <span>{seat.code}</span>
      </div>
    </div>
  );
}