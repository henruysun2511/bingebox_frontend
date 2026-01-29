import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgePermissionTypeEnum } from "@/constants/enum";
import { MOVIE_STATUS_OPTIONS } from "@/constants/filter";
import { MOVIE_SORT_OPTIONS } from "@/constants/sort";
import { useCategoryList } from "@/queries/useCategoryQuery";

interface MovieFilterProps {
    search: string;
    setSearch: (v: string) => void;

    sort: string;
    setSort: (v: any) => void;

    status: string;
    setStatus: (v: string) => void;

    agePermission: string;
    setAgePermission: (v: string) => void;

    releaseDate?: string;
    setReleaseDate: (v: string) => void;

    categories: string[];
    setCategories: (v: string[]) => void;

    setPage: (v: number) => void;
}

export function MovieFilter({
    search,
    setSearch,
    sort,
    setSort,
    status,
    setStatus,
    agePermission,
    setAgePermission,
    releaseDate,
    setReleaseDate,
    categories,
    setCategories,
    setPage,
}: MovieFilterProps) {
    const { data } = useCategoryList();
    const categoryList = data?.data ?? [];

    const handleFilterChange = (fn: (v: any) => void, value: any) => {
        fn(value);
        setPage(1);
    };

    const toggleCategory = (id: string) => {
        setCategories(
            categories.includes(id)
                ? categories.filter((c) => c !== id)
                : [...categories, id]
        );
        setPage(1);
    };

    return (
        <div className="flex flex-wrap gap-3 justify-between">
            {/* SEARCH */}
            <Input
                placeholder="Tìm theo tên..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                className="max-w-xs form-input-custom"
            />

            {/* STATUS */}
            <Select value={status} onValueChange={(v) => handleFilterChange(setStatus, v)}>
                <SelectTrigger className="!w-[250px] select-trigger-custom">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>

                    {MOVIE_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} className="select-item-custom uppercase">
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* AGE */}
            <Select value={agePermission} onValueChange={(v) => handleFilterChange(setAgePermission, v)}>
                <SelectTrigger className="!w-[250px] select-trigger-custom">
                    <SelectValue placeholder="Độ tuổi" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    <SelectItem value="all">Mọi độ tuổi</SelectItem>
                    {Object.values(AgePermissionTypeEnum).map((age) => (
                        <SelectItem key={age} value={age} className="select-item-custom uppercase">
                            Phân loại {age}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* RELEASE DATE */}
            <Input
                type="date"
                value={releaseDate ?? ""}
                onChange={(e) => handleFilterChange(setReleaseDate, e.target.value)}
                className="!w-[160px] form-date-custom"
            />

            {/* SORT */}
            <Select value={sort} onValueChange={(v) => handleFilterChange(setSort, v)}>
                <SelectTrigger className="w-[160px] select-trigger-custom">
                    <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent className="select-content-custom">
                    {MOVIE_SORT_OPTIONS.map((opt) => (
                        <SelectItem className="select-item-custom" key={opt.value} value={opt.value}>
                            {opt.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* CATEGORY FILTER */}
            <div className="flex flex-wrap gap-4 items-center mt-5">
                <div>Thể loại: </div>
                {categoryList?.map((cat) => (
                    <label
                        key={cat._id}
                        className="flex items-center gap-2 text-sm cursor-pointer"
                    >
                        <Checkbox
                            checked={categories.includes(cat._id)}
                            onCheckedChange={() => toggleCategory(cat._id)}
                            className="checkbox-custom"
                        />
                        {cat.name}
                    </label>
                ))}
            </div>
        </div>
    );
}
