import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayOfWeekEnum } from "@/constants/enum";
import { TicketPriceParams } from "@/types/param";
// 1. Import các hook từ ticketPrice-dialog
import { useAgeTypeList } from "@/queries/useAgeTypeQuery";
import { useFormatRoomList } from "@/queries/useFormatRoomQuery";
import { useSeatTypeList } from "@/queries/useSeatTypeQuery";
import { useTimeSlotList } from "@/queries/useTimeSlotQuery";

interface Props {
    params: TicketPriceParams;
    setParams: (p: TicketPriceParams) => void;
    setPage: (p: number) => void;
}

export function TicketPriceFilter({ params, setParams, setPage }: Props) {
    // 2. Fetch data tương tự như dialog
    const { data: formats } = useFormatRoomList({});
    const { data: seatTypes } = useSeatTypeList();
    const { data: ageTypes } = useAgeTypeList({});
    const { data: timeSlots } = useTimeSlotList();

    const handleChange = (key: keyof TicketPriceParams, value: any) => {
        setParams({ ...params, [key]: value === "all" ? undefined : value });
        setPage(1);
    };

    return (
        <div className="flex flex-wrap gap-3 items-center">
            {/* Thứ trong tuần */}
            <Select value={params.dayOfWeek || "all"} onValueChange={(v) => handleChange("dayOfWeek", v)}>
                <SelectTrigger className="w-[150px] select-trigger-custom">
                    <SelectValue placeholder="Chọn thứ" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả các ngày</SelectItem>
                    {Object.values(DayOfWeekEnum).map(day => (
                        <SelectItem className="select-item-custom" key={day} value={day}>{day}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* 3. THÊM CÁC THẺ SELECT FILTER */}
            
            {/* Khung giờ */}
            <Select value={params.timeSlot || "all"} onValueChange={(v) => handleChange("timeSlot", v)}>
                <SelectTrigger className="w-[180px] select-trigger-custom">
                    <SelectValue placeholder="Chọn khung giờ" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả khung giờ</SelectItem>
                    {timeSlots?.data.map((t: any) => (
                        <SelectItem className="select-item-custom" key={t._id} value={t._id}>{t.name} ({t.startTime} - {t.endTime})</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Đối tượng */}
            <Select value={params.ageType || "all"} onValueChange={(v) => handleChange("ageType", v)}>
                <SelectTrigger className="w-[150px] select-trigger-custom">
                    <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả đối tượng</SelectItem>
                    {ageTypes?.data.map((a: any) => (
                        <SelectItem className="select-item-custom" key={a._id} value={a._id}>{a.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Định dạng */}
            <Select value={params.formatRoom || "all"} onValueChange={(v) => handleChange("formatRoom", v)}>
                <SelectTrigger className="w-[150px] select-trigger-custom">
                    <SelectValue placeholder="Chọn định dạng" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả định dạng</SelectItem>
                    {formats?.data.map((f: any) => (
                        <SelectItem className="select-item-custom" key={f._id} value={f._id}>{f.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Loại ghế */}
            <Select value={params.seatType || "all"} onValueChange={(v) => handleChange("seatType", v)}>
                <SelectTrigger className="w-[150px] select-trigger-custom">
                    <SelectValue placeholder="Chọn loại ghế" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả loại ghế</SelectItem>
                    {seatTypes?.data.map((s: any) => (
                        <SelectItem className="select-item-custom" key={s._id} value={s._id}>{s.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Lọc theo giá */}
            <Input
                type="number"
                placeholder="Giá từ..."
                className="!w-[120px] form-input-custom"
                value={params.minPrice || ""}
                onChange={(e) => handleChange("minPrice", Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder="Đến..."
                className="!w-[120px] form-input-custom"
                value={params.maxPrice || ""}
                onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
            />
        </div>
    );
}