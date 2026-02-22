import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DayOfWeekEnum } from "@/constants/enum";
import { TicketPriceParams } from "@/types/param";

interface Props {
    params: TicketPriceParams;
    setParams: (p: TicketPriceParams) => void;
    setPage: (p: number) => void;
}

export function TicketPriceFilter({ params, setParams, setPage }: Props) {
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

            {/* Lọc theo giá */}
            <Input
                type="number"
                placeholder="Giá từ..."
                className="!w-[120px] form-input-custom"
                onChange={(e) => handleChange("minPrice", Number(e.target.value))}
            />
            <Input
                type="number"
                placeholder="Đến..."
                className="!w-[120px] form-input-custom"
                onChange={(e) => handleChange("maxPrice", Number(e.target.value))}
            />
        </div>
    );
}