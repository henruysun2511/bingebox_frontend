import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function PermissionFilter({ filters, setFilters }: any) {
    return (
        <div className="flex flex-wrap gap-5 rounded-xl">
            <Input 
                placeholder="Tìm tên quyền..." 
                className="form-input-custom !w-[250px]"
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
            />
            <Input 
                placeholder="Đường dẫn (path)..." 
                className="form-input-custom !w-[250px]"
                value={filters.path}
                onChange={(e) => setFilters({...filters, path: e.target.value})}
            />
            <Select 
                value={filters.method} 
                onValueChange={(v) => setFilters({...filters, method: v})}
            >
                <SelectTrigger className="!w-[150px] select-trigger-custom">
                    <SelectValue placeholder="Phương thức" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}