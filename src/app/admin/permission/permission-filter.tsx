import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PermissionMethodTypeEnum } from "@/constants/enum";

export function PermissionFilter({ filters, setFilters }: any) {
    return (
        <div className="flex flex-wrap gap-5 rounded-xl">
            <Input
                placeholder="Tìm tên quyền..."
                className="form-input-custom !w-[250px]"
                value={filters.name}
                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            />
            <Input
                placeholder="Đường dẫn (path)..."
                className="form-input-custom !w-[250px]"
                value={filters.path}
                onChange={(e) => setFilters({ ...filters, path: e.target.value })}
            />
            <Select
                value={filters.method}
                onValueChange={(v) => setFilters({ ...filters, method: v })}
            >
                <SelectTrigger className="!w-[150px] select-trigger-custom">
                    <SelectValue placeholder="Phương thức" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả</SelectItem>
                    {Object.values(PermissionMethodTypeEnum).map((method) => (
                        <SelectItem className="select-item-custom" key={method} value={method}>
                            {method}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}