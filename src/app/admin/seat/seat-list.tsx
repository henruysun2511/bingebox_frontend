import SeatItem from "@/components/common/Seat/seat-item"
import { Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import SeatEditor from "./seat-editor"

type SeatUI = {
  id: string
  code: string
  row: string
  column: number | null
  position: { x: number; y: number }
  isBlocked: boolean
  seatType?: { name: string; color: string }
  isCoupleSeat: boolean
  partnerId?: string
}

type SeatRow = {
  rowKey: string
  seats: SeatUI[]
}

const createSeat = (
  row: string,
  column: number | null,
  index: number,
  isBlocked = false
): SeatUI => ({
  id: crypto.randomUUID(),
  row,
  column,
  code: isBlocked ? "TRỐNG" : `${row}${index}`,
  position: { x: index, y: row.charCodeAt(0) },
  isBlocked,
  seatType: isBlocked ? undefined : { name: "Thường", color: "#16a34a" },
  isCoupleSeat: false
})

export default function SeatList(){
    const [rows, setRows] = useState<SeatRow[]>([
    {
      rowKey: "A",
      seats: [
        createSeat("A", 1, 1),
        createSeat("A", null, 2, true),
        createSeat("A", 2, 3),
        createSeat("A", 3, 4)
      ]
    },
    {
      rowKey: "B",
      seats: [
        createSeat("B", 1, 1),
        createSeat("B", 2, 2),
        createSeat("B", 3, 3)
      ]
    }
  ])

  const [selectedSeat, setSelectedSeat] = useState<{
    rowIndex: number
    seatIndex: number
  } | null>(null)

  const reindexRows = (allRows: SeatRow[]) => {
    return allRows.map((row, index) => {
      // index 0 -> A, index 1 -> B, ...
      const newKey = String.fromCharCode(65 + index);

      return {
        ...row,
        rowKey: newKey,
        seats: row.seats.map((seat, sIdx) => {
          return {
            ...seat,
            row: newKey,
          };
        })
      };
    });
  };

  /* ================== THÊM HÀNG ================== */
  const addRowBelow = (rowIndex: number) => {
    setRows(prev => {
      const baseRow = prev[rowIndex];

      // Tạo hàng mới tạm thời (tên gì cũng được vì sẽ reindex)
      const newRow: SeatRow = {
        rowKey: "",
        seats: baseRow.seats.map((s, i) => ({
          ...s,
          id: crypto.randomUUID(),
          // Giữ nguyên cấu trúc nhưng reset id
        }))
      };

      const updated = [...prev];
      updated.splice(rowIndex + 1, 0, newRow);

      // Sau khi chèn, ta chạy reindex để A, B, C, D... luôn đúng
      return reindexRows(updated).map(row => {
        // Logic tính lại mã ghế (A1, A2...) cho từng hàng
        let seatCount = 1;
        row.seats.forEach(s => {
          if (!s.isBlocked) {
            s.code = `${row.rowKey}${seatCount++}`;
          } else {
            s.code = "TRỐNG";
          }
        });
        return row;
      });
    });
  };

  /* ================== XÓA HÀNG ================== */
  const removeRow = (rowIndex: number) => {
    if (rows.length <= 1) {
      toast.info("Phải có ít nhất một hàng ghế!");
      return;
    }

    setRows(prev => {
      const updated = prev.filter((_, i) => i !== rowIndex);
      // Tương tự, xóa xong thì đánh số lại từ đầu
      return reindexRows(updated).map(row => {
        let seatCount = 1;
        row.seats.forEach(s => {
          if (!s.isBlocked) s.code = `${row.rowKey}${seatCount++}`;
        });
        return row;
      });
    });
  };

  return (
    <div className="p-6 space-y-6">
      {rows.map((row, rowIndex) => (
        <div key={row.rowKey} className="flex items-center gap-3">
          <div className="w-6 text-sm opacity-70">{row.rowKey}</div>

          <div className="flex gap-2">
            {row.seats.map((seat, seatIndex) => (
              <SeatItem
                key={seat.id}
                seat={seat}
                active={
                  selectedSeat?.rowIndex === rowIndex &&
                  selectedSeat?.seatIndex === seatIndex
                }
                onClick={() =>
                  setSelectedSeat({ rowIndex, seatIndex })
                }
              />
            ))}
          </div>

          <button
            onClick={() => addRowBelow(rowIndex)}
            className="p-2 hover:bg-zinc-800 rounded"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={() => removeRow(rowIndex)}
            className="p-2 hover:bg-zinc-800 rounded text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {selectedSeat && (
        <SeatEditor
          rows={rows}
          setRows={setRows}
          selected={selectedSeat}
        />
      )}
    </div>
  )
}