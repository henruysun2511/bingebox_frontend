import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { USER_SORT_OPTIONS } from "@/constants/sort";
import { useRoleList } from "@/queries/useRoleQuery";

interface UserFilterProps {
    search: string;
    setSearch: (v: string) => void;
    role: string;
    setRole: (v: string) => void;
    isBlocked: string;
    setIsBlocked: (v: string) => void;
    sort: string;
    setSort: (v: any) => void;
    setPage: (v: number) => void;
}

export function UserFilter({ search, setSearch, role, setRole, isBlocked, setIsBlocked, sort, setSort, setPage }: UserFilterProps) {
    const { data: roleRes } = useRoleList({});
    
    const handleChange = (fn: (v: any) => void, val: any) => {
        fn(val);
        setPage(1);
    };

    return (
        <div className="flex flex-wrap gap-3">
            <Input 
                placeholder="Tìm username..." 
                value={search} 
                onChange={(e) => handleChange(setSearch, e.target.value)}
                className="max-w-xs form-input-custom" 
            />
            
            {/* SORT SELECT */}
            <Select value={sort} onValueChange={(v) => handleChange(setSort, v)}>
                <SelectTrigger className="w-[180px] select-trigger-custom">
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    {USER_SORT_OPTIONS.map((opt) => (
                        <SelectItem className="select-item-custom" key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={role} onValueChange={(v) => handleChange(setRole, v)}>
                <SelectTrigger className="w-[160px] select-trigger-custom">
                    <SelectValue placeholder="Quyền hạn" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả quyền</SelectItem>
                    {roleRes?.data.map((r: any) => (
                        <SelectItem className="select-item-custom" key={r._id} value={r._id}>{r.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={isBlocked} onValueChange={(v) => handleChange(setIsBlocked, v)}>
                <SelectTrigger className="w-[160px] select-trigger-custom">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem className="select-item-custom" value="all">Tất cả</SelectItem>
                    <SelectItem className="select-item-custom" value="true">Đã khóa</SelectItem>
                    <SelectItem className="select-item-custom" value="false">Hoạt động</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}