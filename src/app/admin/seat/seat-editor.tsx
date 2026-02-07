import { useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { toast } from "sonner";

type Props = {
  rows: any[]
  setRows: Function
  selected: { rowIndex: number; seatIndex: number }
  setSelectedSeat: Function // Khai báo thêm prop mới
}

export default function SeatEditor({ rows, setRows, selected, setSelectedSeat }: Props) {
  const { rowIndex, seatIndex } = selected
  const row = rows[rowIndex]
  const seat = row?.seats[seatIndex]


  // 1. Gọi API lấy danh sách loại ghế
  const { data: categoryData } = useSeatTypeList();
  const categories = categoryData?.data || [];

  if (!seat) return null;

  // 2. Hàm xử lý đổi loại ghế
  const handleTypeChange = (categoryId: string) => {
    const selectedCategory = categories.find((c: any) => c._id === categoryId);
    if (!selectedCategory) return;

    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };
      const newSeats = [...currentRow.seats];

      // Cập nhật loại ghế và màu sắc
      newSeats[seatIndex] = {
        ...newSeats[seatIndex],
        seatType: {
          _id: selectedCategory._id,
          name: selectedCategory.name,
          color: selectedCategory.color,
        }
      };

      currentRow.seats = newSeats;
      newRows[rowIndex] = currentRow;
      return newRows;
    });
    toast.success(`Đã đổi sang loại ghế: ${selectedCategory.name}`);
  };

  // Hàm cập nhật lại toàn bộ mã ghế và liên kết đôi trong hàng
  const syncRowData = (row: any) => {
    let count = 1;
    // Bước 1: Đánh số lại mã ghế
    const updatedSeats = row.seats.map((s: any) => {
      const newCode = s.isBlocked ? "TRỐNG" : `${row.rowKey}${count++}`;
      return { ...s, code: newCode };
    });

    // Bước 2: Cập nhật lại partnerSeatCode dựa trên vị trí mới
    return updatedSeats.map((s: any, idx: number) => {
      if (s.isCoupleSeat) {
        // Nếu là ghế đôi, tìm đối tác (luôn nằm cạnh)
        const prev = updatedSeats[idx - 1];
        const next = updatedSeats[idx + 1];

        // Nếu ghế trước là đối tác cũ (theo ID hoặc logic cặp)
        if (prev && prev.isCoupleSeat && (prev.partnerSeatCode === s.code || s.partnerSeatCode === prev.code)) {
          return { ...s, partnerSeatCode: prev.code };
        }
        if (next && next.isCoupleSeat) {
          return { ...s, partnerSeatCode: next.code };
        }
      }
      return s;
    });
  }

  const toggleCoupleSeat = () => {
    if (seat.isBlocked) return;

    // Tìm loại ghế "Ghế đôi" trong danh sách categories
    const coupleCategory = categories.find((c: any) =>
      c.name.toLowerCase().includes("đôi") || c.isCoupleType === true
    );

    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };
      const newSeats = [...currentRow.seats];

      if (seat.isCoupleSeat) {
        // HỦY GHẾ ĐÔI: Trả về màu mặc định (thường là ghế đầu tiên trong list)
        const defaultCat = categories[0];
        const partnerCode = seat.partnerSeatCode;
        currentRow.seats = newSeats.map(s => {
          if (s.code === seat.code || s.code === partnerCode) {
            return {
              ...s,
              isCoupleSeat: false,
              partnerSeatCode: undefined,
              seatType: defaultCat ? { _id: defaultCat._id, name: defaultCat.name, color: defaultCat.color } : s.seatType
            };
          }
          return s;
        });
      } else {
        // TẠO GHẾ ĐÔI
        const nextSeat = newSeats[seatIndex + 1];
        if (!nextSeat || nextSeat.isBlocked || nextSeat.isCoupleSeat) {
          toast.error("Cần một ghế trống bên phải để tạo ghế đôi!");
          return prev;
        }

        const seatTypeUpdate = coupleCategory
          ? { _id: coupleCategory._id, name: coupleCategory.name, color: coupleCategory.color }
          : seat.seatType;

        newSeats[seatIndex] = { ...seat, isCoupleSeat: true, partnerSeatCode: nextSeat.code, seatType: seatTypeUpdate };
        newSeats[seatIndex + 1] = { ...nextSeat, isCoupleSeat: true, partnerSeatCode: seat.code, seatType: seatTypeUpdate };

        currentRow.seats = newSeats;
      }

      newRows[rowIndex] = currentRow;
      return newRows;
    });
  };

  const insertSeat = (isBlocked: boolean, side: "left" | "right") => {
    if (seat.isBlocked) {
      alert("Chọn một ghế thường để thêm!");
      return;
    }

    // Chặn chèn vào giữa cặp đôi
    const nextSeat = rows[rowIndex].seats[seatIndex + 1];
    const prevSeat = rows[rowIndex].seats[seatIndex - 1];
    if (side === "right" && seat.isCoupleSeat && nextSeat?.code === seat.partnerSeatCode) return alert("Không thể chèn vào giữa ghế đôi!");
    if (side === "left" && seat.isCoupleSeat && prevSeat?.code === seat.partnerSeatCode) return alert("Không thể chèn vào giữa ghế đôi!");

    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };
      const newSeats = [...currentRow.seats];
      const index = side === "left" ? seatIndex : seatIndex + 1;

      // Tạo object ghế mới
      const newSeat = {
        ...seat, // Copy toàn bộ thuộc tính của ghế đang chọn (bao gồm seatType, color, room...)
        id: crypto.randomUUID(), // Tạo ID mới để không bị trùng
        _id: undefined, // Xóa _id của API để tránh lỗi khi gửi lên server sau này
        isBlocked: isBlocked,
        isCoupleSeat: false, // Ghế mới thêm mặc định không phải ghế đôi
        partnerSeat: null,
        partnerSeatCode: null,
        // Nếu là ô trống (isBlocked) thì thường không cần seatType, 
        // nhưng nếu là ghế thường thì copy seatType từ ghế đang chọn
        seatType: isBlocked ? undefined : seat.seatType
      };

      // Chèn vào mảng
      newSeats.splice(index, 0, newSeat);

      // Đồng bộ lại mã ghế (A1, A2...) và trả về state mới
      currentRow.seats = syncRowData({ ...currentRow, seats: newSeats });
      newRows[rowIndex] = currentRow;

      return newRows;
    });
    toast.success(`Đã thêm ${isBlocked ? "ô trống" : "ghế"} vào bên ${side === "left" ? "trái" : "phải"}`);
    // setSelectedSeat(null);
  };

  const removeSeat = () => {
    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };

      // Kiểm tra số lượng ghế hiện có trong hàng
      const currentSeatCount = currentRow.seats.length;

      // Trường hợp 1: Nếu là ghế đôi, khi xóa sẽ mất 2 ghế. 
      // Nếu hàng chỉ có đúng 2 ghế này (ghế đôi chiếm hết hàng), thì không cho xóa.
      if (seat.isCoupleSeat && currentSeatCount <= 2) {
        alert("Hàng phải có ít nhất một ghế. Không thể xóa cặp ghế cuối cùng!");
        return prev;
      }

      // Trường hợp 2: Nếu là ghế đơn và hàng chỉ còn đúng 1 ghế.
      if (!seat.isCoupleSeat && currentSeatCount <= 1) {
        alert("Hàng phải có ít nhất một ghế. Không thể xóa ghế cuối cùng!");
        return prev;
      }

      // Logic xóa ghế
      let newSeats;
      if (seat.isCoupleSeat) {
        // Xóa cả ghế hiện tại và đối tác dựa trên partnerSeatCode
        newSeats = currentRow.seats.filter(
          (s: any) => s.code !== seat.code && s.code !== seat.partnerSeatCode
        );
      } else {
        // Xóa ghế đơn bình thường
        newSeats = currentRow.seats.filter((_: any, idx: number) => idx !== seatIndex);
      }

      // Cập nhật lại hàng với danh sách ghế mới và đồng bộ mã ghế
      currentRow.seats = syncRowData({ ...currentRow, seats: newSeats });
      newRows[rowIndex] = currentRow;

      return newRows;
    });
  };

  return (
    <div className="mt-6 w-[400px] rounded-xl bg-neutral-900 border border-neutral-800 shadow-lg p-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="font-semibold text-white text-base tracking-wide">
          Ghế: {seat.code}
        </div>

        <div
          className="w-4 h-4 rounded-full border border-white/20"
          style={{ backgroundColor: seat.seatType?.color }}
        />
      </div>

      {/* CHỌN LOẠI GHẾ */}
      <div className="mb-5 space-y-2">
        <label className="text-[11px] text-neutral-500 uppercase font-semibold tracking-wider">
          Loại ghế
        </label>

        <select
          disabled={seat.isBlocked || seat.isCoupleSeat}
          value={seat.seatType?._id || ""}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 text-neutral-100 rounded-lg px-3 py-2.5 text-sm 
      focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="" disabled>-- Chọn loại ghế --</option>

          {categories
            .filter((c: any) => !c.name.toLowerCase().includes("đôi"))
            .map((cat: any) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>

        {seat.isCoupleSeat && (
          <p className="text-[11px] text-amber-500 italic">
            * Ghế đôi sử dụng cấu hình loại ghế riêng
          </p>
        )}
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-2 gap-3">

        <button
          onClick={() => insertSeat(false, "left")}
          className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-lg py-2 transition-colors"
        >
          + Ghế trái
        </button>

        <button
          onClick={() => insertSeat(false, "right")}
          className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-200 rounded-lg py-2 transition-colors"
        >
          + Ghế phải
        </button>

        <button
          onClick={() => insertSeat(true, "left")}
          className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-500 rounded-lg py-2 transition-colors"
        >
          + Trống trái
        </button>

        <button
          onClick={() => insertSeat(true, "right")}
          className="cursor-pointer text-xs bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-500 rounded-lg py-2 transition-colors"
        >
          + Trống phải
        </button>

        <button
          onClick={toggleCoupleSeat}
          className={`col-span-2 py-2.5 rounded-lg font-medium transition-colors border cursor-pointer
      ${seat.isCoupleSeat
              ? "bg-red-500/15 text-red-400 border-red-500/40 hover:bg-red-500/25"
              : "bg-blue-600/20 text-blue-400 border-blue-500/30 hover:bg-blue-600/30"
            }`}
        >
          {seat.isCoupleSeat ? "Hủy ghế đôi" : "Ghép thành ghế đôi"}
        </button>

        <button
          onClick={removeSeat}
          className="col-span-2 py-2 rounded-lg font-medium text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          Xóa ghế
        </button>

      </div>
    </div>

  );
}