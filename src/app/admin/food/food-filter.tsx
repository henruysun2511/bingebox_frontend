import { Input } from "@/components/ui/input";

interface Props {
    filters: { name: string; minPrice: string; maxPrice: string };
    setFilters: (v: any) => void;
}

export function FoodFilter({ filters, setFilters }: Props) {
    const handleChange = (key: string, value: string) => {
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    return (
        <div className="flex flex-wrap gap-4 items-center">
            <Input
                placeholder="Tên món ăn..."
                value={filters.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className="w-[200px] bg-neutral-900 border-neutral-800"
            />
            <Input
                type="number"
                placeholder="Giá từ..."
                value={filters.minPrice}
                onChange={(e) => handleChange("minPrice", e.target.value)}
                className="w-[150px] bg-neutral-900 border-neutral-800"
            />
            <Input
                type="number"
                placeholder="Giá đến..."
                value={filters.maxPrice}
                onChange={(e) => handleChange("maxPrice", e.target.value)}
                className="w-[150px] bg-neutral-900 border-neutral-800"
            />
        </div>
    );
}