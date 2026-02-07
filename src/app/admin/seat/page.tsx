"use client"

import { Room } from "@/types/object";
import { useState } from "react";
import RoomInfo from "./room-info";
import SeatList from "./seat-list";


export default function SeatPage() {
  // Trạng thái lưu trữ phòng đã chọn
  const [selectedRoom, setSelectedRoom] = useState<Room| null>(null)

  return (
    <>
      {/* Truyền hàm setter vào RoomInfo */}
      <RoomInfo onRoomSelect={setSelectedRoom} />
      
      {/* Chỉ hiển thị SeatList khi đã chọn Room */}
      {selectedRoom ? (
        <SeatList roomId={selectedRoom._id} />
      ) : (
        <div className="p-10 text-center text-zinc-500 italic">
          Vui lòng chọn rạp và phòng chiếu để hiển thị sơ đồ ghế.
        </div>
      )}
    </>
  )
}
