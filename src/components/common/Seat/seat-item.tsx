type Props = {
  seat: any
  active: boolean
  onClick: () => void
}

export default function SeatItem({ seat, active, onClick }: Props) {
  if (seat.isBlocked) {
    return (
      <div
        onClick={onClick}
        className={`w-10 h-10 border border-dashed flex items-center justify-center cursor-pointer
        ${active ? "border-indigo-500" : "border-zinc-600"}`}
      >
        —
      </div>
    )
  }

  return (
    <div
      onClick={onClick}
      style={{ backgroundColor: seat.isCoupleSeat ? "#db2777" : seat.seatType?.color }}
      className={`w-10 h-10 text-xs rounded flex items-center justify-center cursor-pointer transition-all
      ${active ? "ring-2 ring-indigo-500 scale-110" : ""}
      ${seat.isCoupleSeat ? "rounded-none first:rounded-l last:rounded-r border-x border-pink-400" : ""}
      `}
    >
      {seat.code}
    </div>
  )
}