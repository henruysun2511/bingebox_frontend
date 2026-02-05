import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROVINCES } from "@/constants/province";
import { CINEMA_SORT_OPTIONS } from "@/constants/sort";

interface CinemaFilterProps {
    search: string;
    setSearch: (v: string) => void;
    province: string;
    setProvince: (v: string) => void;
    sort: string;
    setSort: (v: any) => void;
    setPage: (v: number) => void;
}

export function CinemaFilter({
    search, setSearch, province, setProvince, sort, setSort, setPage
}: CinemaFilterProps) {

    const handleProvinceChange = (value: string) => {
        setProvince(value);
        setPage(1);
    };

    return (
        <div className="flex flex-wrap gap-3 items-center">
            {/* SEARCH NAME */}
            <Input
                placeholder="Tìm tên rạp..."
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                }}
                className="max-w-xs form-input-custom"
            />

            {/* SELECT PROVINCE */}
            <Select value={province} onValueChange={handleProvinceChange}>
                <SelectTrigger className="select-trigger-custom">
                    <SelectValue placeholder="Tất cả tỉnh thành" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả tỉnh thành</SelectItem>
                    {PROVINCES.map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* SORT */}
            <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1); }}>
                <SelectTrigger className="w-[180px] select-trigger-custom">
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    {CINEMA_SORT_OPTIONS.map((opt) => (
                        <SelectItem className="select-item-custom" key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}