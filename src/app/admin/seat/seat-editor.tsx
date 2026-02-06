
type Props = {
  rows: any[]
  setRows: Function
  selected: { rowIndex: number; seatIndex: number }
}

export default function SeatEditor({ rows, setRows, selected }: Props) {
  const { rowIndex, seatIndex } = selected
  const seat = rows[rowIndex].seats[seatIndex]


  const toggleCoupleSeat = () => {
    // Không cho phép biến ô trống thành ghế đôi
    if (seat.isBlocked) return;

    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };
      const newSeats = [...currentRow.seats];

      // Kiểm tra xem ghế hiện tại đã là ghế đôi chưa
      if (seat.isCoupleSeat) {
        // HỦY GHẾ ĐÔI: Tìm đối tác và biến cả 2 về ghế thường
        const partnerId = seat.partnerId;
        currentRow.seats = newSeats.map(s => {
          if (s.id === seat.id || s.id === partnerId) {
            return { ...s, isCoupleSeat: false, partnerId: undefined };
          }
          return s;
        });
      } else {
        // TẠO GHẾ ĐÔI: Lấy ghế bên phải làm đối tác (nếu có và không bị block)
        const nextSeat = newSeats[seatIndex + 1];
        if (!nextSeat || nextSeat.isBlocked || nextSeat.isCoupleSeat) {
          alert("Cần một ghế trống bên phải không bị chặn để tạo ghế đôi!");
          return prev;
        }

        const partnerId = nextSeat.id;
        const currentId = seat.id;

        newSeats[seatIndex] = { ...seat, isCoupleSeat: true, partnerId: partnerId };
        newSeats[seatIndex + 1] = { ...nextSeat, isCoupleSeat: true, partnerId: currentId };

        currentRow.seats = newSeats;
      }

      newRows[rowIndex] = currentRow;
      return newRows;
    });
  };

  const insertSeat = (isBlocked: boolean, side: "left" | "right") => {
    // 1. Chặn nếu đang chọn ô trống (đã làm ở bước trước)
    if (seat.isBlocked) {
      alert("Không thể thêm ghế bên cạnh một ô trống!");
      return;
    }

    // 2. CHẶN NẾU CHÈN VÀO GIỮA GHẾ ĐÔI
    const nextSeat = rows[rowIndex].seats[seatIndex + 1];
    const prevSeat = rows[rowIndex].seats[seatIndex - 1];

    if (side === "right" && seat.isCoupleSeat && nextSeat?.id === seat.partnerId) {
      alert("Không thể chèn vào giữa cặp ghế đôi!");
      return;
    }

    if (side === "left" && seat.isCoupleSeat && prevSeat?.id === seat.partnerId) {
      alert("Không thể chèn vào giữa cặp ghế đôi!");
      return;
    }

    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };
      const newSeats = [...currentRow.seats];

      const index = side === "left" ? seatIndex : seatIndex + 1;

      // Thực hiện chèn ghế mới
      newSeats.splice(index, 0, {
        ...seat,
        id: crypto.randomUUID(),
        isBlocked,
        isCoupleSeat: false, // Ghế mới chèn vào luôn là ghế thường
        partnerId: undefined,
        seatType: isBlocked ? undefined : seat.seatType
      });

      // Cập nhật lại mã ghế (A1, A2...)
      let count = 1;
      currentRow.seats = newSeats.map(s => ({
        ...s,
        code: s.isBlocked ? "TRỐNG" : `${currentRow.rowKey}${count++}`
      }));

      newRows[rowIndex] = currentRow;
      return newRows;
    });
  };

  const removeSeat = () => {
    setRows((prev: any[]) => {
      const newRows = [...prev];
      const currentRow = { ...newRows[rowIndex] };

      let newSeats;
      if (seat.isCoupleSeat) {
        // Xóa cả ghế hiện tại và đối tác
        newSeats = currentRow.seats.filter(s => s.id !== seat.id && s.id !== seat.partnerId);
      } else {
        // Xóa ghế đơn như bình thường
        newSeats = currentRow.seats.filter((_, idx) => idx !== seatIndex);
      }

      // Tính toán lại mã ghế
      let count = 1;
      currentRow.seats = newSeats.map((s) => ({
        ...s,
        code: s.isBlocked ? "TRỐNG" : `${currentRow.rowKey}${count++}`,
      }));

      newRows[rowIndex] = currentRow;
      return newRows;
    });
  };

  return (
    <div className="mt-6 p-4 rounded bg-zinc-900 w-[400px]">
      <div className="mb-2 font-semibold">
        Ghế đang chọn: {seat.code || "Ô trống"}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => insertSeat(false, "right")} className="btn">
          + Ghế phải
        </button>
        <button onClick={() => insertSeat(true, "right")} className="btn">
          + Trống phải
        </button>
        <button onClick={() => insertSeat(false, "left")} className="btn">
          + Ghế trái
        </button>
        <button onClick={() => insertSeat(true, "left")} className="btn">
          + Trống trái
        </button>
        <button
          onClick={removeSeat}
          className="btn text-red-500"
        >
          Xóa ghế
        </button>
        <button
          onClick={toggleCoupleSeat}
          className={`btn ${seat.isCoupleSeat ? "bg-pink-600" : "bg-zinc-700"}`}
        >
          {seat.isCoupleSeat ? "Hủy ghế đôi" : "Ghép đôi (với bên phải)"}
        </button>
      </div>
    </div>
  )
}