"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface ShowtimeFilterProps {
    filters: {
        date?: Date;
    };
    setFilters: (val: any) => void;
}

export function ShowtimeFilter({ filters, setFilters}: ShowtimeFilterProps) {
    // Fetch dữ liệu cho các Select

    const updateFilter = (key: string, value: any) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="space-y-2">
            <span className="text-xs text-neutral-500 font-medium">Ngày chiếu</span>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-[160px] justify-start form-input-custom text-white font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.date
                            ? format(new Date(filters.date), "dd/MM/yyyy")
                            : "Chọn ngày"}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-neutral-900 border-neutral-800">
                    <Calendar
                        mode="single"
                        selected={filters.date ? new Date(filters.date) : undefined}
                        onSelect={(d) =>
                            updateFilter("date", d ? format(d, "yyyy-MM-dd") : "")
                        }
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}